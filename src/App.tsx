import { Toaster } from 'solid-toast';
import DecoderComponent from './components/decoder/decoder.component';

export default function App() {
  return (
    <main class='bg-slate-100 h-full overflow-y-auto'>
      <Toaster position='bottom-center' />
      <div class='p-5 max-w-3xl mx-auto'>
        <DecoderComponent title='Decode from Base64 format' />
      </div>
    </main>
  );
}
