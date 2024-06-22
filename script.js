//--Main App Script--//
document.addEventListener('DOMContentLoaded', () => {
    const adhanAudio = document.getElementById('adhan-audio');

    // Function to fetch prayer times
    const fetchPrayerTimes = async () => {
        try {
            const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=London&country=UK&method=2'); // Replace with your API endpoint and parameters
            const data = await response.json();

            // Assuming the API returns an object with prayer times
            const times = data.data.timings;

            // Update the HTML elements with the fetched prayer times
            document.getElementById('fajr').textContent = times.Fajr;
            document.getElementById('dhuhr').textContent = times.Dhuhr;
            document.getElementById('asr').textContent = times.Asr;
            document.getElementById('maghrib').textContent = times.Maghrib;
            document.getElementById('isha').textContent = times.Isha;

            // Convert prayer times to Date objects
            const prayerTimes = {
                fajr: convertToTimeObject(times.Fajr),
                dhuhr: convertToTimeObject(times.Dhuhr),
                asr: convertToTimeObject(times.Asr),
                maghrib: convertToTimeObject(times.Maghrib),
                isha: convertToTimeObject(times.Isha)
            };

            // Check prayer times every minute
            setInterval(() => {
                checkPrayerTimes(prayerTimes);
            }, 60000);
        } catch (error) {
            console.error('Error fetching prayer times:', error);
        }
    };

    // Function to convert time string to Date object
    const convertToTimeObject = (timeString) => {
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours, 10) + 12;
        }
        if (modifier === 'AM' && hours === '12') {
            hours = 0;
        }
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    };

    // Function to check current time against prayer times
    const checkPrayerTimes = (prayerTimes) => {
        const now = new Date();
        for (const prayer in prayerTimes) {
            const prayerTime = prayerTimes[prayer];
            if (now.getHours() === prayerTime.getHours() && now.getMinutes() === prayerTime.getMinutes()) {
                playAdhan(prayer);
                sendPushNotification(prayer); // Send push notification
            }
        }
    };

    // Function to play adhan audio
    const playAdhan = (prayer) => {
        if (document.getElementById(`${prayer}-toggle`).checked) {
            adhanAudio.play();
        }
    };

    // Call the function to fetch and update prayer times
    fetchPrayerTimes();
});

//--Deed-Checklist--//
document.addEventListener('DOMContentLoaded', () => {
    const checklistItems = document.querySelectorAll('.checklist-item');

    checklistItems.forEach(item => {
        item.addEventListener('click', () => {
            item.classList.toggle('completed');
        });
    });
});

function navigateTo(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', () => {
    // Other script functionalities
});

//-- Ramadan Calendar--//
document.addEventListener('DOMContentLoaded', () => {
    const calendarDays = document.querySelectorAll('.calendar-day');

    calendarDays.forEach(day => {
        day.addEventListener('click', () => {
            console.log('Day clicked:', day); // Debugging log
            day.classList.toggle('completed');
        });
    });
});

//-- Service Worker and Push Notifications --//
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
                subscribeUserToPush(registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

const subscribeUserToPush = async (registration) => {
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BEanh9MotqWSOATpymCvKBsGtqKJ8uKfX_N9YpG2fKcdfJYGQiluOqVRwXLFrK8rM8SyF3GRZf3MADRQnNagqz0') // Replace with your actual public VAPID key
        });

        await fetch('http://localhost:3000/subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('User is subscribed to push notifications.');
    } catch (error) {
        console.error('Failed to subscribe the user:', error);
    }
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
        } else {
            console.log('Notification permission denied.');
        }
    });
}

// Call this function to request notification permission, e.g., on a button click
document.getElementById('request-permission-button').addEventListener('click', requestNotificationPermission);

// Function to send a push notification
function sendPushNotification(prayer) {
    const payload = JSON.stringify({
        title: 'Prayer Time Reminder',
        body: `It is time for the ${prayer} prayer.`,
    });

    fetch('http://localhost:3000/send-notification', {
        method: 'POST',
        body: payload,
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Push notification sent:', data);
    })
    .catch(error => {
        console.error('Error sending push notification:', error);
    });
}
