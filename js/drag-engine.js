const DragEngine = (() => {
  let draggedElement = null;
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

  return {
    init() {
      document.addEventListener('dragstart', handleDragStart, true);
      document.addEventListener('dragover', handleDragOver, true);
      document.addEventListener('dragleave', handleDragLeave, true);
      document.addEventListener('drop', handleDrop, true);
      document.addEventListener('dragend', handleDragEnd, true);
    },

    setDragData(element, data) {
      element.setAttribute('draggable', 'true');
      element.classList.add('draggable');
      
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
