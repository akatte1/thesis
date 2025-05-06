<script>
    // Komponendi loomisel kasutati ChatGPT abi
    // Pildi komponent, mida saab suurendada ja liigutada
    export let source 

    let imgRef
    let imgWidth = 0, imgHeight = 0

    let scale = 1
    let startX = 0, startY = 0, lastX = 0, lastY = 0
    let translateX = 0, translateY = 0
    let isPanning = false

    // Pildi suuruse leidmine
    function getImageSize() {
        if (imgRef) {
            imgWidth = imgRef.naturalWidth
            imgHeight = imgRef.naturalHeight
        }
    }

    // Suurendamise loogika
    function onWheel(event) {
        event.preventDefault()
        const zoomIntensity = 0.005
        scale += event.deltaY * -zoomIntensity
        scale = Math.min(Math.max(1, scale), 3) 
        clampTranslation()
    }

    // Liigutamise loogika
    function onMouseDown(event) {
        event.preventDefault()
        isPanning = true
        startX = event.clientX  
        startY = event.clientY
        lastX = translateX
        lastY = translateY
    }

    // Liigutamise loogika
    function onMouseMove(event) {
        if (isPanning) {
            const deltaX = (event.clientX - startX) / scale
            const deltaY = (event.clientY - startY) / scale

            translateX = lastX + deltaX
            translateY = lastY + deltaY

            clampTranslation()
        }
    }

    function onMouseUp(event) {
        isPanning = false
    }

    // Et liigutused jääksid jõusse
    function clampTranslation() {
        if (!imgRef) return

        const scaledWidth = imgWidth * scale
        const scaledHeight = imgHeight * scale

        const maxX = Math.max(0, (scaledWidth - imgWidth) / 2)
        const maxY = Math.max(0, (scaledHeight - imgHeight) / 2)

        const minX = scaledWidth > imgWidth ? -maxX : 0
        const minY = scaledHeight > imgHeight ? -maxY : 0

        translateX = Math.max(minX, Math.min(maxX, translateX))
        translateY = Math.max(minY, Math.min(maxY, translateY))
    }


</script>

<div 
    class="w-full h-full overflow-hidden rounded-lg flex justify-center items-center"
    on:wheel={onWheel}
    on:mousedown={onMouseDown}
    on:mousemove={onMouseMove}
    on:mouseup={onMouseUp}
    role="group"
>
    <img 
        bind:this={imgRef}
        on:load={getImageSize()}
        src={source}
        alt="pilt"
        class="rounded-lg w-auto h-auto max-w-full max-h-full object-contain"
        style="transform: scale({scale}) translate({translateX}px, {translateY}px);"
    />
</div>

<style> 
</style>