<script>
    export let imageSrc = null;

    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isDragging = false;
    let startX, startY;
    
    const imageRef = (node) => {
        const onWheel = (e) => {
        e.preventDefault();
        const zoomIntensity = 0.1;
        scale += e.deltaY < 0 ? zoomIntensity : -zoomIntensity;
        scale = Math.max(1, Math.min(scale, 3));  // Limit the zoom level between 1x and 3x
        updateTransform();
        };
        
        const onMouseDown = (e) => {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        document.body.style.cursor = 'grabbing';
        };
        
        const onMouseMove = (e) => {
        if (isDragging) {
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            updateTransform();
        }
        };
        
        const onMouseUp = () => {
        isDragging = false;
        document.body.style.cursor = 'grab';
        };
        
        const onMouseLeave = () => {
        isDragging = false;
        document.body.style.cursor = 'grab';
        };

        node.addEventListener('wheel', onWheel);
        node.addEventListener('mousedown', onMouseDown);
        node.addEventListener('mousemove', onMouseMove);
        node.addEventListener('mouseup', onMouseUp);
        node.addEventListener('mouseleave', onMouseLeave);
        
        return {
        destroy() {
            node.removeEventListener('wheel', onWheel);
            node.removeEventListener('mousedown', onMouseDown);
            node.removeEventListener('mousemove', onMouseMove);
            node.removeEventListener('mouseup', onMouseUp);
            node.removeEventListener('mouseleave', onMouseLeave);
        }
        };
    };

    const updateTransform = () => {
        imageRef.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    };
</script>

<div class="w-full h-96 flex items-center justify-center relative">
    <img bind:this={imageRef}  src={imageSrc} alt="pilt" class="rounded-lg w-auto h-auto max-w-full max-h-full object-contain">
</div>
