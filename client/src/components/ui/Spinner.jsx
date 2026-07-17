const Spinner = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center
                  min-h-[200px] gap-3">
    <div className="w-10 h-10 border-4 border-gray-200
                    border-t-red-700 rounded-full animate-spin" />
    <p className="text-gray-500 text-sm">{text}</p>
  </div>
)

export default Spinner