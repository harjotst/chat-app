export default function ChatTab() {
  return (
    <div class='flex flex-col space-y-4 cursor-pointer'>
      <div class='flex items-center px-6 py-3 hover:bg-gray-100'>
        <img
          class='w-16 h-16 mr-4 rounded-full'
          src='https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          alt='Profile picture'
        />
        <div>
          <div class='font-bold'>Person's Name</div>
          <div class='text-sm text-gray-400'>
            Last message... <span class='text-xs'>3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
