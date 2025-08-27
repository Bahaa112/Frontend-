class Add {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.jobFormPopup = document.getElementById('jobFormPopup');
        this.imageInput = document.getElementById('imageInput');
        this.imagePreview = document.getElementById('imagePreview');
        this.submitJobBtn = document.getElementById('submitJobBtn');
        this.cancelJobBtn = document.getElementById('cancelJobBtn');
        this.addBtn = document.getElementById('add');
        this.savedJobs = JSON.parse(localStorage.getItem('jobs')) || [];
        this.savedJobs.forEach(job => this.addJobCard(job));
        this.addBtn.addEventListener('click', () => this.showForm());
        this.cancelJobBtn.addEventListener('click', () => this.hideForm());
        this.imageInput.addEventListener('change', () => this.previewImage());
        this.submitJobBtn.addEventListener('click', () => this.handleSubmit());
        this.searchInput = document.querySelector('.search-input');
        this.searchInput.addEventListener('input', () => this.search());
    }
    

    addJobCard(cardData) {
    const addCard = document.createElement('div');
    addCard.className = 'jobList';

    addCard.innerHTML = `
        <div class="image">
            <img src="${cardData.image}" alt="${cardData.company}" class="photosnap-image">
        </div>
        <div class="photosnap-details">
            <div class="photosnap-first">
                <h3 class="photosnap-name">${cardData.company}</h3>
                ${cardData.isNew ? '<span class="photosnap-new">NEW!</span>' : ''}
                ${cardData.isFeatured ? '<span class="photosnap-featured">FEATURED</span>' : ''}
            </div>
            <div class="photosnap-second">
                <h2 class="photosnap-job">${cardData.position}</h2>
            </div>
            <div class="photosnap-fourth">
                <ul>
                    <li class="photosnap-day">${cardData.posted}</li>
                    <li class="photosnap-time">${cardData.time}</li>
                    <li class="photosnap-country">${cardData.location}</li>
                </ul>
            </div>
        </div>
        <div class="photosnap-fifth"></div>`;

    const tagsContainer = addCard.querySelector('.photosnap-fifth');
    for (let i = 0; i < cardData.tags.length; i++) {
        const btn = document.createElement('button');
        btn.textContent = cardData.tags[i];
        tagsContainer.appendChild(btn);
    }

    this.container.insertBefore(addCard, this.container.firstChild);
}

    showForm() {
        this.jobFormPopup.style.display = 'flex';
    }

    hideForm() {
        this.jobFormPopup.style.display = 'none';
        this.imagePreview.innerHTML = '<span>Image Preview</span>';
    }

    previewImage() {
        const file = this.imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                this.imagePreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            this.imagePreview.innerHTML = '<span>Image Preview</span>';
        }
    }

    handleSubmit() {
        const company = document.getElementById('companyInput').value;
        const position = document.getElementById('positionInput').value;
        if (!company || !position) return;

        const imageFile = this.imageInput.files[0];
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = (e) => this.createCard(e.target.result);
            reader.readAsDataURL(imageFile);
        } else {
            this.createCard('');
        }
    }

    createCard(imageData) {
        const tagsInput = document.getElementById('tagsInput').value.split(',');
        const tags = [];
        for (let i = 0; i < tagsInput.length; i++) {
            tags.push(tagsInput[i].trim());
        }

        const jobData = {
            company: document.getElementById('companyInput').value,
            position: document.getElementById('positionInput').value,
            image: imageData,
            isNew: document.getElementById('isNewInput').checked,
            isFeatured: document.getElementById('isFeaturedInput').checked,
            posted: document.getElementById('postedInput').value || 'Today',
            time: document.getElementById('timeInput').value || 'Full Time',
            location: document.getElementById('locationInput').value || 'Remote',
            tags: tags
        };

        this.addJobCard(jobData);

        this.savedJobs.push(jobData);
        localStorage.setItem('jobs', JSON.stringify(this.savedJobs));

        this.resetForm();
        this.hideForm();
    }

    resetForm() {
        document.getElementById('companyInput').value = '';
        document.getElementById('positionInput').value = '';
        this.imageInput.value = '';
        document.getElementById('isNewInput').checked = false;
        document.getElementById('isFeaturedInput').checked = false;
        document.getElementById('postedInput').value = '';
        document.getElementById('timeInput').value = '';
        document.getElementById('locationInput').value = '';
        document.getElementById('tagsInput').value = '';
        this.imagePreview.innerHTML = '<span>Image Preview</span>';
    }
    search(){
        const query = this.searchInput.value.toLowerCase();
        Array.from(this.container.children).forEach(card => {
            const company = card.querySelector('.photosnap-name').textContent.toLowerCase();
            if(company.includes(query)){
                card.style.display='';
            }else{
                card.style.display='none';
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Add('.jobs');
});
