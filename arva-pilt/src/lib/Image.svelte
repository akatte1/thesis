<script>
    export let source 

    let scale = 1
    let startX = 0, startY = 0, lastX = 0, lastY = 0;
    let translateX = 0, translateY = 0
    let isPanning = false

    function onWheel(event) {
        event.preventDefault();
        const zoomIntensity = 0.005;
        scale += event.deltaY * -zoomIntensity;
        scale = Math.min(Math.max(1, scale), 3); // Restrict zoom levels
    }

    function onMouseDown(event) {
        event.preventDefault()
        isPanning = true
        startX = event.clientX  
        startY = event.clientY
        lastX = translateX;
        lastY = translateY;
    }

    function onMouseMove(event) {
        if (isPanning) {
            const deltaX = event.clientX - startX;
            const deltaY = event.clientY - startY;

            translateX = lastX + deltaX;
            translateY = lastY + deltaY;
        }
    }

    function onMouseUp(event) {
        isPanning = false
    }


</script>

<div 
    class="zoom-container"
    on:wheel={onWheel}
    on:mousedown={onMouseDown}
    on:mousemove={onMouseMove}
    on:mouseup={onMouseUp}
    role="group"
>
    <img 
        src={source}
        alt="Zoomable Image"
        class="rounded-lg w-auto h-auto max-w-full max-h-full object-contain "
        style="transform: scale({scale}) translate({translateX}px, {translateY}px);"
    />
</div>

<style>
    .zoom-container {
        width: 800px;
        height: 600px;
        overflow: hidden;
        border: 1px solid #ddd;
        cursor: grab;
        position: relative;
    }

    .zoomable-image {
        width: 100%;
        height: auto;
        transform-origin: center;
        transition: transform 0.1s ease-out;
    }
</style>