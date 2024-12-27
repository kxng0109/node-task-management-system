const axios = require("axios");
const server = "http://localhost:3000"

const loginUser = async () => {
    try {
        // Login request
        const response = await axios.post(`${server}/api/login`, {
            email: "email_address",
            password: "password",
        });
        console.log("Login successful:", response.data.data);
        return response.data.data; // Return the token to use
    } catch (error) {
        console.error("Error during login:", error.response ? error.response.data : error.message);
        throw error; // If login fails, throw an error
    }
};

const fetchUserData = async (authToken) => {
    try {
        if (!authToken) {
            console.log("No auth token found. Please login first.");
            return;
        }

        // Fetch user data using the auth token
        const response = await axios.get(`${server}/api/tasks`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
    } catch (error) {
        console.error("Error fetching user data:", error.response ? error.response.data : error.message);
    }
};

const main = async () => {
    try {
        // Log in and get the auth token
        const authToken = await loginUser();

        // Once the token is received, fetch user data
        await fetchUserData(authToken);
    } catch (error) {
        console.error("Error in main flow:", error.message);
    }
};

// Run the main function
main();

