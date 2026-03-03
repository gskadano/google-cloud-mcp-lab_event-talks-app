document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const searchInput = document.getElementById('category-search');
    let talksData = [];

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const generateSchedule = (talks) => {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

        talks.forEach((talk, index) => {
            const startTime = new Date(currentTime);
            const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

            const scheduleItem = document.createElement('div');
            scheduleItem.classList.add('schedule-item');

            const timeString = `${formatTime(startTime)} - ${formatTime(endTime)}`;

            scheduleItem.innerHTML = `
                <div class="schedule-time">${timeString}</div>
                <h2>${talk.title}</h2>
                <div class="speakers">By: ${talk.speakers.join(', ')}</div>
                <p>${talk.description}</p>
                <div class="categories">
                    ${talk.categories.map(cat => `<span class="category-tag">${cat}</span>`).join('')}
                </div>
            `;
            scheduleContainer.appendChild(scheduleItem);

            // Add lunch break after the 3rd talk
            if (index === 2) {
                const lunchStartTime = new Date(endTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + 60 * 60 * 1000);
                const lunchItem = document.createElement('div');
                lunchItem.classList.add('schedule-item', 'lunch');
                lunchItem.innerHTML = `
                    <div class="schedule-time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
                    <h2>Lunch Break</h2>
                `;
                scheduleContainer.appendChild(lunchItem);
                currentTime = new Date(lunchEndTime);
            } else {
                 currentTime = new Date(endTime);
            }
            
            // Add 10-minute transition
            if (index < talks.length - 1) {
                currentTime.setMinutes(currentTime.getMinutes() + 10);
            }

        });
    };

    const filterTalks = (searchTerm) => {
        const filteredTalks = talksData.filter(talk =>
            talk.categories.some(category =>
                category.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
        generateSchedule(filteredTalks);
    };

    fetch('talks.json')
        .then(response => response.json())
        .then(data => {
            talksData = data;
            generateSchedule(talksData);
        });

    searchInput.addEventListener('input', (e) => {
        filterTalks(e.target.value);
    });
});
