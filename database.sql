---------------------------------------------- TABLES CREATION ----------------------------------------------

-- DONORS
CREATE TABLE donors (
	donor_id SERIAL PRIMARY KEY,
	full_name VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	blood_group VARCHAR(5) NOT NULL,
	phone VARCHAR(20),
	address TEXT,
	latitude FLOAT,
	longitude FLOAT,
	is_active BOOLEAN DEFAULT true,
	created_at TIMESTAMP DEFAULT NOW()
);

-- Constraint for valid blood groups
ALTER TABLE donors
ADD CONSTRAINT chk_donor_blood_group
CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'));

---------------------------------------------------------------------------------------

-- PATIENTS
CREATE TABLE patients (
	patient_id SERIAL PRIMARY KEY,
	full_name VARCHAR(100) NOT NULL,
	email VARCHAR(100) NOT NULL,
	password TEXT NOT NULL,
	phone VARCHAR(20),
	created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------------------------------------

-- HOSPITALS
CREATE TABLE hospitals (
	hospital_id SERIAL PRIMARY KEY,
	hospital_name VARCHAR(150) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	phone VARCHAR(20),
	address TEXT,
	license_no VARCHAR(100),
	is_verified BOOLEAN DEFAULT false,
	created_at TIMESTAMP DEFAULT NOW()
);

---------------------------------------------------------------------------------------

-- BLOOD REQUESTS
CREATE TABLE requests (
	request_id SERIAL PRIMARY KEY,
	requester_id INT NOT NULL,
	requester_type VARCHAR(20) NOT NULL,
	blood_group VARCHAR(5) NOT NULL,
	quantity INT DEFAULT 1,
	deadline TIMESTAMP NOT NULL,
	hospital_name VARCHAR(150),
	latitude FLOAT,
	longitude FLOAT,
	address TEXT,
	notes TEXT,
	status VARCHAR(20) DEFAULT 'open',
	created_at TIMESTAMP DEFAULT NOW(),

	CONSTRAINT chk_requester_type CHECK (requester_type IN ('patient', 'hospital')),
	CONSTRAINT chk_request_status CHECK (status IN ('open', 'fulfilled', 'cancelled')),
	CONSTRAINT chk_request_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'))
);

---------------------------------------------------------------------------------------

-- DONATIONS (history log)
CREATE TABLE donations (
	donation_id SERIAL PRIMARY KEY,
	donor_id INT REFERENCES donors(donor_id) ON DELETE SET NULL,
	request_id INT REFERENCES requests(request_id) ON DELETE CASCADE,
	donation_at TIMESTAMP DEFAULT NOW(),
	notes TEXT
);

---------------------------------------------------------------------------------------

-- EMAIL LOGS
CREATE TABLE email_logs (
	log_id SERIAL PRIMARY KEY,
	donor_id INT REFERENCES donors(donor_id) ON DELETE SET NULL,
	request_id INT REFERENCES requests(request_id) ON DELETE CASCADE,
	sent_at TIMESTAMP DEFAULT NOW(),
	delivery_status VARCHAR(20) DEFAULT 'sent'
);

---------------------------------------------------------------------------------------

-- ADMIN
CREATE TABLE admin_users (
	admin_id SERIAL PRIMARY KEY,
	username VARCHAR(50) UNIQUE NOT NULL,
	password TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT NOW()
);

-------------------------------------------------------------------------------------------------------------



---------------------------------------------- KEY OPERATIONS ----------------------------------------------

-- Find Active Donors by Blood Group
SELECT donor_id, full_name, phone, address, blood_group
FROM donors
WHERE blood_group = 'AB+' AND is_active = true;

-- Find Nearby Donors (Haversine Formula for Distance in KM)
WITH donor_distances AS (
    SELECT 
        donor_id, 
        full_name, 
        phone, 
        blood_group,
        (6371 * acos(
            cos(radians(27.7172)) * cos(radians(latitude)) * 
            cos(radians(longitude) - radians(85.3240)) + 
            sin(radians(27.7172)) * sin(radians(latitude))
        )) AS distance_km
    FROM donors
    WHERE blood_group = 'AB+' 
      AND is_active = true
      AND latitude IS NOT NULL 
      AND longitude IS NOT NULL  -- prevent NULL calculation errors
)
SELECT * 
FROM donor_distances
WHERE distance_km < 10
ORDER BY distance_km;

-- View All Open Requests
SELECT r.*,
	CASE
	  WHEN r.requester_type = 'patient' THEN p.full_name
	  WHEN r.requester_type = 'hospital' THEN h.hospital_name
	END AS requester_name
FROM requests r
LEFT JOIN patients p ON r.requester_id = p.patient_id AND r.requester_type = 'patient'
LEFT JOIN hospitals h ON r.requester_id = h.hospital_id AND r.requester_type = 'hospital'
WHERE r.status = 'open';




------------------ TEST ------------------

-- List all Tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;



-------------- Sample Data Insertions ----------------

-- Sample Donors
INSERT INTO donors (full_name, email, password, blood_group, phone, address, latitude, longitude) VALUES
('Rohit Ranjan Yadav', 'rohit@gmail.com', 'hashed_pass_1', 'AB+', '9801234567', 'Kathmandu', 27.7172, 85.3240),
('Dil Krishna Laghu', 'dil@gmail.com', 'hashed_pass_2', 'A-', '9807654321', 'Lalitpur', 27.6588, 85.3247),
('Dipson Shrestha', 'dipson@gmail.com', 'hashed_pass_3', 'B+', '9812345678', 'Bhaktapur', 27.6710, 85.4298);

-------------------------------------------------------

-- Sample Patient
INSERT INTO patients (full_name, email, password, phone) VALUES
('Samir Vheju', 'samir@gmail.com', 'hashed_pass_4', '9841122334');

-------------------------------------------------------

-- Sample Hospital
INSERT INTO hospitals (hospital_name, email, password, phone, address, license_no, is_verified) VALUES
('Teaching Hospital', 'teaching@hospital.com', 'hashed_pass_5', '01-4412301', 'Maharajgunj, Kathmandu', 'LIC-2024-001', true);

-------------------------------------------------------

-- Sample Blood Request
INSERT INTO requests (requester_id, requester_type, blood_group, quantity, deadline, hospital_name, latitude, longitude, address, notes) VALUES
(1, 'patient', 'O+', 2, NOW() + INTERVAL '3 days', 'Teaching Hospital', 27.7172, 85.3240, 'Maharajgunj', 'Urgent surgery needed');

-------------------------------------------------------

-- Sample Donation
INSERT INTO donations (donor_id, request_id, notes) VALUES
(1, 1, 'Donated 2 units successfully');













