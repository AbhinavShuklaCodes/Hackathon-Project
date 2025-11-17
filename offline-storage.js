// Offline Storage Management
class OfflineStorage {
    // Save alert to local storage
    static saveAlert(alert) {
        const alerts = this.getAlerts();
        alerts.push(alert);
        localStorage.setItem('hearthline_alerts', JSON.stringify(alerts));
    }

    // Get all alerts from local storage
    static getAlerts() {
        const alerts = localStorage.getItem('hearthline_alerts');
        return alerts ? JSON.parse(alerts) : [];
    }

    // Save message to local storage
    static saveMessage(message) {
        const messages = this.getMessages();
        messages.push(message);
        localStorage.setItem('hearthline_messages', JSON.stringify(messages));
    }

    // Get all messages from local storage
    static getMessages() {
        const messages = localStorage.getItem('hearthline_messages');
        return messages ? JSON.parse(messages) : [];
    }

    // Save device to local storage
    static saveDevice(device) {
        const devices = this.getDevices();
        const existingIndex = devices.findIndex(d => d.id === device.id);
        
        if (existingIndex >= 0) {
            devices[existingIndex] = device;
        } else {
            devices.push(device);
        }
        
        localStorage.setItem('hearthline_devices', JSON.stringify(devices));
    }

    // Get all devices from local storage
    static getDevices() {
        const devices = localStorage.getItem('hearthline_devices');
        return devices ? JSON.parse(devices) : [];
    }

    // Clear all data (for testing/reset)
    static clearAllData() {
        localStorage.removeItem('hearthline_alerts');
        localStorage.removeItem('hearthline_messages');
        localStorage.removeItem('hearthline_devices');
    }

    // Get storage usage information
    static getStorageInfo() {
        let totalSize = 0;
        
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key) && key.startsWith('hearthline_')) {
                totalSize += localStorage[key].length;
            }
        }
        
        return {
            totalSize: totalSize,
            alertsCount: this.getAlerts().length,
            messagesCount: this.getMessages().length,
            devicesCount: this.getDevices().length
        };
    }
}