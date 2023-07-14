import ChatTab from './components/ChatTab';
import { SignUpLogIn } from './components/SignUpLogIn';

function App() {
  return (
    <div className='h-screen flex flex-col items-center justify-center'>
      <div className='w-9/12 h-5/6 flex border border-gray-300 rounded-lg shadow-xl bg-white overflow-hidden'>
        <aside class='flex flex-col justify-between w-1/3 overflow-auto border-r border-gray-300'>
          <div>
            <h2 class='text-base font-bold pl-6 py-4'>Messages</h2>
            <div className='flex flex-col'>
              <ChatTab />
              <ChatTab />
              <ChatTab />
            </div>
          </div>
          <div class='flex items-center justify-between border-t px-3 py-4'>
            <div class='flex items-center'>
              <img
                class='w-10 h-10 rounded-full'
                src='https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                alt="User's picture"
              />
              <div class='ml-4 font-bold'>User's Name</div>
            </div>
            <button class='w-10 h-10 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                class='h-5 w-5'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  stroke-width='2'
                  d='M10 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0zm0 6a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </button>
          </div>
        </aside>
        <section className='w-2/3 bg-white overflow-auto flex flex-col justify-between'>
          <div class='flex justify-between items-center p-4 border-b border-gray-300'>
            <div class='flex items-center space-x-4'>
              <img
                class='w-12 h-12 rounded-full'
                src='https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
                alt="Person's picture"
              />
              <div class='font-bold'>Person's Name</div>
            </div>
            <button class='w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-full'>
              i
            </button>
          </div>
          <div className='p-4'>
            <div className='flex flex-col space-y-4'>
              <div className='p-2 rounded-md bg-green-200'>Your message</div>
              <div className='p-2 rounded-md bg-blue-200'>
                Other person's message
              </div>
            </div>
            <div className='mt-4 flex flex-row items-center space-x-2'>
              <button class='w-9 h-8 flex items-center justify-center bg-transparent border border-gray-500 text-gray-500 font-bold rounded-full'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  class='w-4 h-4'
                >
                  <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M12 4v16m8-8H4'
                  />
                </svg>
              </button>
              <input
                type='text'
                className='w-full px-3 py-2 border border-gray-400 focus:border-gray-600 focus:outline-none focus:shadow-md rounded-md bg-gray-100 placeholder-gray-400 text-black'
                placeholder='Type your message here'
              />
              <button className='px-3 py-2 bg-blue-500 text-white rounded-md'>
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
