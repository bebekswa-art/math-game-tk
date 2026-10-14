const DragEngine = (() => {
  let draggedElement = null;
  let touchIdentifier = null;
  const dropZones = [];
  const dropCallbacks = [];

  function handleDragStart(e) {
    draggedElement = e.target;
    e.dataTransfer.effectAllowed = 'move';
    
    if (draggedElement.hasAttribute('data-drag-id')) {
      e.dataTransfer.setData('text/plain', draggedElement.getAttribute('data-drag-id'));
    }
    
    draggedElement.classList.add('dragging');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    dropZones.forEach(zone => {
      if (e.target === zone || zone.contains(e.target)) {
        zone.classList.add('drop-active');
      } else {
        zone.classList.remove('drop-active');
      }
    });
  }

  function handleDragLeave(e) {
    if (!e.target.classList.contains('drop-zone')) {
      dropZones.forEach(zone => {
        if (!zone.contains(e.relatedTarget)) {
          zone.classList.remove('drop-active');
        }
      });
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    
    if (!draggedElement) return;
    
    let targetZone = null;
    for (const zone of dropZones) {
      if (e.target === zone || zone.contains(e.target)) {
        targetZone = zone;
        break;
      }
    }
    
    if (targetZone) {
      const dragData = {
        source: draggedElement,
        target: targetZone,
        data: {
          id: draggedElement.getAttribute('data-drag-id'),
          type: draggedElement.getAttribute('data-drag-type')
        }
      };
      
      dropCallbacks.forEach(callback => callback(dragData));
    }
  }

  function handleDragEnd(e) {
    draggedElement.classList.remove('dragging');
    dropZones.forEach(zone => zone.classList.remove('drop-active'));
    draggedElement = null;
  }

  function handleTouchStart(e) {
    const touch = e.touches[0];
    touchIdentifier = touch.identifier;
    draggedElement = e.target;
    
    draggedElement.classList.add('dragging');
  }

  function handleTouchMove(e) {
    if (!draggedElement || !touchIdentifier) return;
    
    e.preventDefault();
    const touch = Array.from(e.touches).find(t => t.identifier === touchIdentifier);
    if (!touch) return;

    const touchX = touch.clientX;
    const touchY = touch.clientY;
    const elementAtTouch = document.elementFromPoint(touchX, touchY);

    dropZones.forEach(zone => {
      if (elementAtTouch === zone || zone.contains(elementAtTouch)) {
        zone.classList.add('drop-active');
      } else {
        zone.classList.remove('drop-active');
      }
    });
  }

  function handleTouchEnd(e) {
    if (!draggedElement) return;

    const touch = Array.from(e.changedTouches).find(t => t.identifier === touchIdentifier);
    if (!touch) return;

    const touchX = touch.clientX;
    const touchY = touch.clientY;
    const elementAtTouch = document.elementFromPoint(touchX, touchY);

    let targetZone = null;
    for (const zone of dropZones) {
      if (elementAtTouch === zone || zone.contains(elementAtTouch)) {
        targetZone = zone;
        break;
      }
    }

    if (targetZone) {
      const dragData = {
        source: draggedElement,
        target: targetZone,
        data: {
          id: draggedElement.getAttribute('data-drag-id'),
          type: draggedElement.getAttribute('data-drag-type')
        }
      };
      
      dropCallbacks.forEach(callback => callback(dragData));
    }

    draggedElement.classList.remove('dragging');
    dropZones.forEach(zone => zone.classList.remove('drop-active'));
    draggedElement = null;
    touchIdentifier = null;
  }

  return {
    init() {
      document.addEventListener('dragstart', handleDragStart, true);
      document.addEventListener('dragover', handleDragOver, true);
      document.addEventListener('dragleave', handleDragLeave, true);
      document.addEventListener('drop', handleDrop, true);
      document.addEventListener('dragend', handleDragEnd, true);
      
      document.addEventListener('touchstart', handleTouchStart, true);
      document.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
      document.addEventListener('touchend', handleTouchEnd, true);
    },

    setDragData(element, data) {
      element.setAttribute('draggable', 'true');
      element.classList.add('draggable');
      element.setAttribute('touch-action', 'none');
      
      if (data.id) {
        element.setAttribute('data-drag-id', data.id);
      }
      if (data.type) {
        element.setAttribute('data-drag-type', data.type);
      }
    },

    setDropZone(element, onDrop) {
      element.classList.add('drop-zone');
      dropZones.push(element);
      
      if (typeof onDrop === 'function') {
        dropCallbacks.push(onDrop);
      }
    },

    onDrop(callback) {
      if (typeof callback === 'function') {
        dropCallbacks.push(callback);
      }
    },

    getDraggedElement() {
      return draggedElement;
    },

    getDropZones() {
      return dropZones;
    }
  };
})();

