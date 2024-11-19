document.addEventListener('DOMContentLoaded', async () => {
    await loadCollections();

    document.getElementById('createCollectionBtn').addEventListener('click', createCollection);
    document.getElementById('deleteCollectionBtn').addEventListener('click', deleteCollection);
    document.getElementById('addFaceBtn').addEventListener('click', addFace);
    document.getElementById('detectFaceBtn').addEventListener('click', detectFace);
});

async function loadCollections() {
    const response = await fetch('/api/collections');
    const data = await response.json();
    const select = document.getElementById('collectionSelect');

    // Clear previous options
    select.innerHTML = '';

    data.CollectionIds.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = id;
        select.appendChild(option);
    });

    // Set default collection
    if (data.CollectionIds.length > 0) {
        select.value = data.CollectionIds[0];
    }
}

async function createCollection() {
    const collectionId = document.getElementById('newCollection').value;
    const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ collectionId })
    });

    if (response.ok) {
        alert('Collection created successfully');
        document.getElementById('newCollection').value = '';
        await loadCollections();
    } else {
        alert('Failed to create collection');
    }
}

async function deleteCollection() {
    const collectionId = document.getElementById('collectionSelect').value;
    if (confirm(`Are you sure you want to delete collection: ${collectionId}?`)) {
        const response = await fetch(`/api/collections?collectionId=${collectionId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Collection deleted successfully');
            await loadCollections();
        } else {
            alert('Failed to delete collection');
        }
    }
}

async function addFace() {
    const collectionId = document.getElementById('collectionSelect').value;
    const name = document.getElementById('faceName').value;
    const image = document.getElementById('faceImage').files[0];

    const formData = new FormData();
    formData.append('collectionId', collectionId);
    formData.append('name', name);
    formData.append('image', image);

    const response = await fetch('/api/addFace', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('Face added successfully');
        document.getElementById('faceName').value = '';
        document.getElementById('faceImage').value = '';
    } else {
        alert('Failed to add face');
    }
}

async function detectFace() {
    const collectionId = document.getElementById('collectionSelect').value;
    const image = document.getElementById('faceImage').files[0];

    const formData = new FormData();
    formData.append('collectionId', collectionId);
    formData.append('image', image);

    const response = await fetch('/api/detectFace', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();

    console.log(data);

    const detectedFaces = document.getElementById('detectedFaces');

    if (data && data.length > 0) {
        const names = data
            .filter(item => item.face) // Filter out elements without 'face' key
            .map(item => item.face.ExternalImageId.replace(/_/g, ' '));
        const namesString = names.join(', ');

        detectedFaces.innerHTML = `Detected faces: ${namesString}`;
    } else {
        detectedFaces.innerHTML = 'No faces detected';
    }
}
