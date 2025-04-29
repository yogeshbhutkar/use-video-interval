# use-video-interval

A React hook that lets you run a callback at custom intervals during HTML5 video playback.

## Features

- Specify any interval (in milliseconds or seconds) for your callback  
- Automatically suspends when the video is paused or has ended  
- Works with React refs  
- Lightweight

## Installation

```bash
npm install use-video-interval
# or
yarn add use-video-interval
```

## Usage

```jsx
import { useRef, useState } from 'react';

function App() {
    const videoRef = useRef<HTMLVideoElement>( null );
    const [ showOverlay, setShowOverlay ] = useState( false );

    useVideoInterval( {
        videoRef,
        intervalCallbacks: {
            3: () => setShowOverlay(true),
            5: () => alert('This is 8 seconds!'),
            1: () => console.log('Reached 6s mark')
        },
        options: {
            threshold: 2,
            triggerOnce: true
        }
    } );

    return (
        <>
            <video ref={ videoRef } src="" />
            { showOverlay && <Overlay /> }
        </>
    );
}
```
