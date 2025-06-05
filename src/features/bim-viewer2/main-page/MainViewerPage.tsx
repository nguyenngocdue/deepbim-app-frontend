import Header from '@/sections/ Header';
import ModelPreview from './components/ModelPreview';


export default function MainViewerPage() {
  return (
    <>
      <Header/>
      <div className='mt-20 lg:px-6'>
          <ModelPreview/>
      </div>
    </>
  )
}
