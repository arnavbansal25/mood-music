import React from 'react';

function Canvas(props) {

    const { draw, ...rest } = props;

    const canvasRef = React.useRef(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        draw(canvas)

    }, [draw])

    return (
        <canvas
            width="500vw"
            ref={canvasRef}
            {...props}
        />
    )
}

export default Canvas;