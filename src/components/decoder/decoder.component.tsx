import { gsap } from 'gsap';
import { createSignal, onMount } from 'solid-js';
import { Show } from 'solid-js/web';
import toast from 'solid-toast';
import ClipboardIcon from '../clipboard-icon';

interface Props {
  title: string;
}

export default function DecoderComponent(props: Props) {
  const [output, setOutput] = createSignal('');

  let inputTxtarea: HTMLTextAreaElement = undefined!;

  const BUTTON_DECODE = '.btn-decode';
  const BUTTON_CLEAR = '.btn-clear';

  /** From localStorage */
  const SAVED_INPUT = 'si';

  /** From localStorage */
  const SAVED_OUTPUT = 'so';

  // Should not be used on both "from" and "to"
  const outputHiddenState: gsap.TweenVars = {
    scale: 1.1,
    opacity: 0,
    ease: 'back',
  };

  onMount(() => {
    gsap.set(BUTTON_CLEAR, { opacity: 0 });
    const savedInput = localStorage.getItem(SAVED_INPUT);
    const savedOutput = localStorage.getItem(SAVED_OUTPUT);

    if (savedInput) {
      inputTxtarea.value = savedInput;
    }

    if (savedOutput) {
      setOutput(savedOutput);
      animate();
    }
  });

  function decodeHandler(): void {
    if (!inputTxtarea.value.trim().length) {
      return;
    }

    try {
      setOutput(window.atob(inputTxtarea.value));
      toast.success('Decoded successfully');

      animate();

      saveStorage();
    } catch (err) {
      toast.error('Something went wrong');
    }
  }

  function clearHandler(): void {
    inputTxtarea.value = '';
    inputTxtarea.readOnly = false;

    gsap.to(BUTTON_CLEAR, {
      x: -100,
      opacity: 0,
      ease: 'back',
    });

    gsap.to(BUTTON_DECODE, {
      x: 0,
      opacity: 1,
      ease: 'back',
      delay: 0.2,
    });

    gsap.to('.output', { scale: 1.1, opacity: 0, ease: 'back' }).then(() => {
      setOutput('');
      saveStorage();
      gsap.from('.input', outputHiddenState);
      gsap.from('.output-fallback', outputHiddenState);
    });

    gsap.to('.clippy', { opacity: 0 });
  }

  function copyHandler(): void {
    navigator.clipboard.writeText(output());
    toast.success('Copied to clipboard', { icon: '🎉' });
  }

  function saveStorage(): void {
    localStorage.setItem(SAVED_INPUT, inputTxtarea.value);
    localStorage.setItem(SAVED_OUTPUT, output());
  }

  function animate(): void {
    inputTxtarea.readOnly = true;

    gsap.from('.output', outputHiddenState);
    gsap.to(BUTTON_DECODE, {
      x: 100,
      opacity: 0,
      ease: 'back',
    });
    gsap.set(BUTTON_CLEAR, { opacity: 1, x: 0 });
    gsap.from(BUTTON_CLEAR, {
      x: -100,
      opacity: 0,
      ease: 'back',
      delay: 0.2,
    });

    gsap.to('.clippy', { opacity: 1 });
  }

  return (
    <>
      <h1 class='font-bold text-xl'>{props.title}</h1>
      <p class='leading-6 text-gray-500 text-sm'>
        Simply enter data then push the decode button
      </p>
      {/* <label
        for='about'
        class='mt-5 block text-sm font-medium leading-6 text-gray-900'>
        About
      </label> */}
      <Show when={!output()}>
        <div class='mt-2'>
          <textarea
            ref={inputTxtarea}
            rows='7'
            class='input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 resize-none read-only:bg-gray-100 read-only:pointer-events-none read-only:select-none'></textarea>
        </div>

        <p class='mt-1 text-sm leading-6 text-gray-600'>
          This only decodes string data
        </p>
      </Show>

      <div class='flex justify-between'>
        <button
          onClick={decodeHandler}
          type='button'
          class={`btn-decode mt-5 rounded-md bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
            output() ? 'pointer-events-none' : ''
          }`}>
          Decode
        </button>

        <button
          onClick={clearHandler}
          type='button'
          class={`btn-clear mt-5 rounded-md bg-slate-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 ${
            !output() ? 'pointer-events-none' : ''
          }`}>
          Clear
        </button>
      </div>

      <div class='mt-5 relative group'>
        <Show when={output()} fallback={<FallbackOutput />}>
          <textarea
            readOnly
            rows='20'
            class='output block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
            value={output()}></textarea>

          <button
            onClick={copyHandler}
            class='clippy absolute top-0 -right-10 py-2'>
            <ClipboardIcon class='hover:!text-sky-600 text-indigo-600 active:scale-125 transition' />
          </button>
        </Show>
      </div>
    </>
  );
}

function FallbackOutput() {
  return (
    <>
      <div class='output-fallback w-full h-56 rounded-md bg-gray-200 animate-pulse'></div>
    </>
  );
}
