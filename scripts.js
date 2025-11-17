// Main Application Logic
class HearthlineApp {
    constructor() {
        this.init();
    }

    init() {
        // Initialize components
        this.initializeServiceWorker();
        this.setupEventListeners();
        this.loadStoredData();
        this.updateConnectionStatus();
        
        // Set up periodic status updates
        setInterval(() => {
            this.updateConnectionStatus();
        }, 5000);
    }

    // Initialize Service Worker for PWA functionality
    async initializeServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('./service-worker.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // Set up all event listeners
    setupEventListeners() {
        // Alert functionality
        document.getElementById('send-alert').addEventListener('click', () => this.showAlertModal());
        document.getElementById('cancel-alert').addEventListener('click', () => this.hideAlertModal());
        document.getElementById('confirm-alert').addEventListener('click', () => this.sendAlert());

        // Message functionality
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Network functionality
        document.getElementById('scan-devices').addEventListener('click', () => this.scanForDevices());
        document.getElementById('sync-data').addEventListener('click', () => this.syncData());

        // Online/offline detection
        window.addEventListener('online', () => this.updateConnectionStatus());
        window.addEventListener('offline', () => this.updateConnectionStatus());
    }

    // Load data from offline storage
    loadStoredData() {
        // Load alerts
        const alerts = OfflineStorage.getAlerts();
        this.displayAlerts(alerts);

        // Load messages
        const messages = OfflineStorage.getMessages();
        this.displayMessages(messages);

        // Load devices
        const devices = OfflineStorage.getDevices();
        this.displayDevices(devices);
    }

    // Show alert modal
    showAlertModal() {
        document.getElementById('alert-modal').style.display = 'flex';
    }

    // Hide alert modal
    hideAlertModal() {
        document.getElementById('alert-modal').style.display = 'none';
        document.getElementById('alert-details').value = '';
    }

    // Send emergency alert
    sendAlert() {
        const type = document.getElementById('alert-type').value;
        const details = document.getElementById('alert-details').value.trim();
        
        if (!details) {
            alert('Please provide alert details');
            return;
        }

        const alert = {
            id: Date.now().toString(),
            type: type,
            details: details,
            timestamp: new Date().toISOString(),
            status: 'active'
        };

        // Store alert locally
        OfflineStorage.saveAlert(alert);
        
        // Display alert
        this.displayAlert(alert);
        
        // Broadcast alert via mesh network (simulated)
        MeshNetwork.broadcastAlert(alert);
        
        // Hide modal and reset form
        this.hideAlertModal();
        
        // Show confirmation
        this.showNotification('Emergency alert sent successfully');
    }

    // Display all alerts
    displayAlerts(alerts) {
        const alertsList = document.getElementById('alerts-list');
        alertsList.innerHTML = '';
        
        alerts.forEach(alert => this.displayAlert(alert));
    }

    // Display a single alert
    displayAlert(alert) {
        const alertsList = document.getElementById('alerts-list');
        const alertElement = document.createElement('div');
        alertElement.className = `alert-item ${alert.type}`;
        
        const time = new Date(alert.timestamp).toLocaleTimeString();
        
        alertElement.innerHTML = `
            <div class="alert-header">
                <span>${this.formatAlertType(alert.type)}</span>
                <span class="alert-time">${time}</span>
            </div>
            <div class="alert-details">${alert.details}</div>
        `;
        
        alertsList.insertBefore(alertElement, alertsList.firstChild);
    }

    // Format alert type for display
    formatAlertType(type) {
        const types = {
            medical: 'Medical Emergency',
            security: 'Security Threat',
            resource: 'Resource Shortage',
            evacuation: 'Evacuation Needed',
            other: 'Emergency Alert'
        };
        return types[type] || 'Emergency Alert';
    }

    // Send message to team
    sendMessage() {
        const input = document.getElementById('message-input');
        const messageText = input.value.trim();
        
        if (!messageText) return;

        const message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'You', // In a real app, this would be the user's name
            timestamp: new Date().toISOString()
        };

        // Store message locally
        OfflineStorage.saveMessage(message);
        
        // Display message
        this.displayMessage(message);
        
        // Broadcast message via mesh network (simulated)
        MeshNetwork.broadcastMessage(message);
        
        // Clear input
        input.value = '';
        
        // Show confirmation
        this.showNotification('Message sent');
    }

    // Display all messages
    displayMessages(messages) {
        const messagesList = document.getElementById('messages-list');
        messagesList.innerHTML = '';
        
        messages.forEach(message => this.displayMessage(message));
    }

    // Display a single message
    displayMessage(message) {
        const messagesList = document.getElementById('messages-list');
        const messageElement = document.createElement('div');
        messageElement.className = 'message-item';
        
        const time = new Date(message.timestamp).toLocaleTimeString();
        
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="message-sender">${message.sender}</span>
                <span class="message-time">${time}</span>
            </div>
            <div class="message-text">${message.text}</div>
        `;
        
        messagesList.appendChild(messageElement);
        messagesList.scrollTop = messagesList.scrollHeight;
    }

    // Scan for nearby devices
    scanForDevices() {
        this.showNotification('Scanning for nearby devices...');
        
        // Simulate device discovery
        setTimeout(() => {
            const newDevices = MeshNetwork.scanForDevices();
            this.displayDevices(newDevices);
            this.showNotification(`Found ${newDevices.length} devices`);
        }, 2000);
    }

    // Display connected devices
    displayDevices(devices) {
        const devicesList = document.getElementById('devices-list');
        const connectedCount = document.getElementById('connected-devices');
        
        devicesList.innerHTML = '';
        connectedCount.textContent = devices.filter(d => d.connected).length;
        
        devices.forEach(device => {
            const deviceElement = document.createElement('div');
            deviceElement.className = `device-item ${device.connected ? 'connected' : ''}`;
            deviceElement.innerHTML = `
                <div class="device-name">${device.name}</div>
                <div class="device-status">${device.connected ? 'Connected' : 'Available'}</div>
            `;
            devicesList.appendChild(deviceElement);
        });
    }

    // Sync data with connected devices
    syncData() {
        this.showNotification('Syncing data with connected devices...');
        
        // Simulate data synchronization
        setTimeout(() => {
            const syncedData = MeshNetwork.syncData();
            
            // Update local storage with synced data
            if (syncedData.alerts && syncedData.alerts.length > 0) {
                syncedData.alerts.forEach(alert => OfflineStorage.saveAlert(alert));
            }
            
            if (syncedData.messages && syncedData.messages.length > 0) {
                syncedData.messages.forEach(message => OfflineStorage.saveMessage(message));
            }
            
            // Refresh displays
            this.loadStoredData();
            
            this.showNotification('Data synchronization complete');
        }, 3000);
    }

    // Update connection status display
    updateConnectionStatus() {
        const indicator = document.getElementById('connection-indicator');
        const text = document.getElementById('connection-text');
        
        if (navigator.onLine) {
            indicator.className = 'connection-indicator connection-online';
            text.textContent = 'Online';
        } else {
            indicator.className = 'connection-indicator connection-offline';
            text.textContent = 'Offline';
        }
    }

    // Show notification to user
    showNotification(message) {
        // Simple notification implementation
        // In a real app, you might use a more sophisticated notification system
        console.log('Notification:', message);
        
        // You could implement a toast notification here
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Hearthline', { body: message });
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HearthlineApp();
});

// Request notification permission
if ('Notification' in window) {
    Notification.requestPermission();
}