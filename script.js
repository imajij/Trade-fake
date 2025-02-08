// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";

// Firebase configuration (Ensure this matches your Firebase project settings)
const firebaseConfig = {
    apiKey: "AIzaSyDgizZnII2p76CTtIIc4ClA7jnj3EHBoo8",
    authDomain: "fake-trade.firebaseapp.com",
    projectId: "fake-trade",
    storageBucket: "fake-trade.firebasestorage.app",
    messagingSenderId: "697354550610",
    appId: "1:697354550610:web:2830f7c985e50bbd418e8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Elements
const loginBtn = document.querySelector(".login-btn");
const accountBtn = document.querySelector(".account-btn");
const profileImg = document.querySelector(".profile-img");
const accountMenu = document.querySelector('.account-menu');
const dropdownContent = document.querySelector('.dropdown-content');
const logoutBtn = document.querySelector('.logout-btn');

// Google Login Function
const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Update UI with user info
    accountBtn.textContent = user.displayName;
    profileImg.src = user.photoURL;
    loginBtn.style.display = "none"; // Hide login button after login
    accountMenu.style.display = "block"; // Show account menu after login
  } catch (error) {
    console.error("Login Error:", error.message);
  }
};

// Google Logout Function
const googleLogout = async () => {
  try {
    await signOut(auth);
    location.reload(); // Refresh the page to its original form
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
};

// Attach Event Listeners
loginBtn.addEventListener("click", googleLogin);
logoutBtn.addEventListener("click", googleLogout);

document.addEventListener('DOMContentLoaded', () => {
    const stockCards = document.querySelectorAll('.stock-card');
    const stockDetailsSidebar = document.querySelector('.stock-details-sidebar');
    const closeSidebarBtn = document.querySelector('.close-btn');
    const topStocks = document.querySelector('.top-stocks');

    // Function to create chart configuration
    function createChartConfig(data, isMiniChart = true) {
        return {
            type: 'line',
            data: {
                labels: data.map(item => item.time),
                datasets: [{
                    data: data.map(item => item.price),
                    borderColor: data[data.length - 1].price >= data[0].price ? '#48BB78' : '#F56565',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: isMiniChart ? 0 : 2,
                    pointHoverRadius: isMiniChart ? 0 : 4,
                    tension: 0  // This makes the lines straight instead of curved
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: !isMiniChart,
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'white',
                        titleColor: '#2D3748',
                        bodyColor: '#2D3748',
                        borderColor: '#E2E8F0',
                        borderWidth: 1,
                        padding: 8,
                        displayColors: false,
                        callbacks: {
                            label: function(context) {
                                return '₹' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: !isMiniChart,
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        display: !isMiniChart,
                        grid: {
                            display: !isMiniChart,
                            color: '#E2E8F0'
                        },
                        ticks: {
                            callback: value => '₹' + value.toLocaleString()
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        };
    }

    // Mock stock data - replace with real API data
    function getStockData() {
        return [
            { time: '9:15', price: 500 },
            { time: '10:30', price: 515 },
            { time: '11:45', price: 508 },
            { time: '13:00', price: 520 },
            { time: '14:15', price: 535 },
            { time: '15:30', price: 525 }
        ];
    }

    // Initialize mini charts
    stockCards.forEach(card => {
        const chartContainer = card.querySelector('.chart-container');
        const canvas = document.createElement('canvas');
        chartContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        new Chart(ctx, createChartConfig(getStockData(), true));

        // Click handler for stock cards
        card.addEventListener('click', () => {
            stockDetailsSidebar.style.display = 'block';
            topStocks.style.width = '55%'; // Change width to 55%

            // Update detailed chart
            const detailedChartContainer = stockDetailsSidebar.querySelector('.chart-container');
            detailedChartContainer.innerHTML = '<canvas></canvas>';
            const detailedCtx = detailedChartContainer.querySelector('canvas').getContext('2d');
            new Chart(detailedCtx, createChartConfig(getStockData(), false));

            // Update stock info
            const ticker = card.querySelector('.ticker').textContent;
            const price = card.querySelector('.price').textContent;
            stockDetailsSidebar.querySelector('h2').textContent = `${ticker} Details`;
        });
    });

    // Close sidebar handler
    closeSidebarBtn?.addEventListener('click', () => {
        stockDetailsSidebar.style.display = 'none';
        topStocks.style.width = '80%';
    });
});