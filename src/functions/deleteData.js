import * as SecureStore from 'expo-secure-store';

export default deleteData = async (key) => {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}