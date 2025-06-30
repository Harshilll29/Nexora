import Sidebar from './Sidebar'
import Navbar from './Navbar';

const Layout = ({children, showSidebar=false}) => {
  return (
    <div className='h-screen'> 
      <div className='flex h-full'> 
        {showSidebar && <Sidebar/>}

        <div className='flex-1 flex flex-col min-h-0'> 
            <Navbar/>
            <main className='flex-1 overflow-y-auto'> 
                {children}
            </main>
        </div>
      </div>
    </div>
  )
}

export default Layout