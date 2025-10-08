document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // --- ADSGRAM SDK INITIALIZATION ---
    // =================================================================
    const AdController = window.Adsgram.init({ blockId: "int-15864" });

    // =================================================================
    // --- CONFIGURATIONS & CONSTANTS ---
    // =================================================================
    const REEL_ITEM_HEIGHT = 90;
    const SPIN_DURATION = 4000;
    const POINTS_PER_BLOCK = 1000000;
    const TON_PER_BLOCK = 0.3;
    const SOL_PER_BLOCK = 0.0038;
    const WITHDRAWAL_FEE_PERCENT = 1.5;
    const MIN_TON_WITHDRAWAL = 1;
    const MIN_SOL_WITHDRAWAL = 0.01;
    const GACHA_ITEMS = [ { symbol: '🍓', points: 5 }, { symbol: '🍌', points: 10 }, { symbol: '🍊', points: 15 }, { symbol: '🍉', points: 20 }, { symbol: '🥑', points: 25 }, { symbol: '🌶️', points: 30 }, { symbol: '🍇', points: 60 }, { symbol: '💎', points: 100 } ];
    const STREAK_REWARDS = [
        { day: 1, points: 2000, pulls: 3 }, { day: 2, points: 4000, pulls: 5 }, { day: 3, points: 6000, pulls: 7 }, { day: 4, points: 8000, pulls: 9 }, { day: 5, points: 10000, pulls: 10 }, { day: 6, points: 12000, pulls: 11 }, { day: 7, points: 15000, pulls: 15 }
    ];
    const DAILY_TASKS = [
        { id: 'pull10', description: 'Pull the lever 10 times', target: 10, progressKey: 'pullCount', reward: { points: 500 } },
        { id: 'watch2', description: 'Watch 2 Ads', target: 2, progressKey: 'adWatchCount', reward: { pulls: 5 } },
        { id: 'winPair', description: 'Win a Pair 3 times', target: 3, progressKey: 'pairWins', reward: { points: 2500 } },
        { id: 'earn10k', description: 'Earn 10,000 points', target: 10000, progressKey: 'pointsWon', reward: { points: 3000 } },
        { id: 'winJackpot', description: 'Win a Jackpot', target: 1, progressKey: 'jackpotWins', reward: { pulls: 20 } }
    ];
    
    // NEW Timed Rewards Constants
    const TREASURE_COOLDOWN = 3 * 60 * 1000; // 3 minutes
    const TREASURE_REWARD_POINTS = 2000;
    const TICKET_COOLDOWN = 5 * 60 * 1000; // 5 minutes
    const TICKET_REWARD_PULLS = 10;

    // =================================================================
    // --- STATE MANAGEMENT ---
    // =================================================================
    let user = {};
    let isSpinning = false;
    const defaultUser = {
        name: 'Player One', username: '@player1', points: 1250, pulls: 0, ton: 0, sol: 0,
        dailyStreak: 0, lastStreakClaimDate: null,
        taskProgress: { pullCount: 0, adWatchCount: 0, jackpotWins: 0, pairWins: 0, pointsWon: 0 },
        claimedTasks: [], lastTaskResetDate: null,
        lastTreasureClaimTimestamp: null,
        lastTicketClaimTimestamp: null,
    };

    // =================================================================
    // --- DOM ELEMENT SELECTORS ---
    // =================================================================
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-button');
    const profileButton = document.getElementById('profile-button');
    const pointsValueTop = document.getElementById('points-value');
    const profileNameEl = document.getElementById('profile-name');
    const profileUsernameEl = document.getElementById('profile-username');
    const profilePointsEl = document.getElementById('profile-points-value');
    const pullsAmountEl = document.getElementById('currency-amount');
    const gachaMachine = document.getElementById('gacha-machine');
    const pullButton = document.getElementById('pull-button');
    const watchAdButton = document.getElementById('watch-ad-button');
    const reels = document.querySelectorAll('.reel');
    const resultText = document.getElementById('result-text');
    const reelShutter = document.querySelector('.reel-shutter');
    const tonBalanceEl = document.getElementById('ton-balance');
    const solBalanceEl = document.getElementById('sol-balance');
    const exchangeButton = document.getElementById('exchange-button');
    const withdrawButton = document.getElementById('withdraw-button');
    const pointsToExchangeInput = document.getElementById('points-to-exchange');
    const exchangeFeedbackEl = document.getElementById('exchange-feedback');
    const withdrawalAmountInput = document.getElementById('withdrawal-amount');
    const cryptoSelect = document.getElementById('crypto-select');
    const walletAddressInput = document.getElementById('wallet-address');
    const withdrawalFeedbackEl = document.getElementById('withdrawal-feedback');
    const streakContainer = document.getElementById('streak-container');
    const tasksContainer = document.getElementById('tasks-container');
    const treasureTimerEl = document.getElementById('treasure-timer');
    const treasureClaimBtn = document.getElementById('treasure-claim-button');
    const ticketTimerEl = document.getElementById('ticket-timer');
    const ticketClaimBtn = document.getElementById('ticket-claim-button');

    // =================================================================
    // --- DATA PERSISTENCE & INITIALIZATION ---
    // =================================================================
    function loadUserData() {
        const savedUser = localStorage.getItem('ytdGachaUser');
        user = savedUser ? { ...defaultUser, ...JSON.parse(savedUser) } : { ...defaultUser };
    }

    function saveUserData() {
        localStorage.setItem('ytdGachaUser', JSON.stringify(user));
    }

    function initializeApp() {
        loadUserData();
        checkDailyResets();
        updateAllUI();
        initializeReels();
        setupEventListeners();
        updateButtonStates();
        renderTasksPage();
        initializeTimedRewards();
    }
    
    // =================================================================
    // --- TIMED REWARDS LOGIC ---
    // =================================================================
    function initializeTimedRewards() {
        setInterval(updateTimedRewards, 1000);
        updateTimedRewards();
    }

    function updateTimedRewards() {
        const now = Date.now();
        const treasureCooldownEnd = user.lastTreasureClaimTimestamp + TREASURE_COOLDOWN;
        if (now < treasureCooldownEnd) {
            const remaining = treasureCooldownEnd - now;
            treasureTimerEl.textContent = formatTime(remaining);
            treasureClaimBtn.disabled = true;
        } else {
            treasureTimerEl.textContent = `+${TREASURE_REWARD_POINTS.toLocaleString()} Pts`;
            treasureClaimBtn.disabled = false;
        }
        const ticketCooldownEnd = user.lastTicketClaimTimestamp + TICKET_COOLDOWN;
        if (now < ticketCooldownEnd) {
            const remaining = ticketCooldownEnd - now;
            ticketTimerEl.textContent = formatTime(remaining);
            ticketClaimBtn.disabled = true;
        } else {
            ticketTimerEl.textContent = `+${TICKET_REWARD_PULLS} Pulls`;
            ticketClaimBtn.disabled = false;
        }
    }

    function formatTime(ms) {
        const totalSeconds = Math.ceil(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function handleClaimTreasure() {
        treasureClaimBtn.disabled = true;
        treasureClaimBtn.textContent = 'Wait...';
        setTimeout(() => {
            user.points += TREASURE_REWARD_POINTS;
            user.lastTreasureClaimTimestamp = Date.now();
            saveUserData();
            updateAllUI();
            updateTimedRewards();
            treasureClaimBtn.textContent = 'Claim';
        }, 1500);
    }
    
    function handleClaimTickets() {
        ticketClaimBtn.disabled = true;
        ticketClaimBtn.textContent = 'Wait...';
        setTimeout(() => {
            user.pulls += TICKET_REWARD_PULLS;
            user.lastTicketClaimTimestamp = Date.now();
            saveUserData();
            updateAllUI();
            updateButtonStates();
            updateTimedRewards();
            ticketClaimBtn.textContent = 'Claim';
        }, 1500);
    }

    // =================================================================
    // --- EVENT LISTENERS & NAVIGATION ---
    // =================================================================
    function setupEventListeners() {
        navButtons.forEach(button => button.addEventListener('click', () => navigateTo(button.dataset.page)));
        profileButton.addEventListener('click', () => navigateTo('profile-page'));
        pullButton.addEventListener('click', handlePull);
        watchAdButton.addEventListener('click', handleWatchAd);
        exchangeButton.addEventListener('click', handleExchange);
        withdrawButton.addEventListener('click', handleWithdraw);
        treasureClaimBtn.addEventListener('click', handleClaimTreasure);
        ticketClaimBtn.addEventListener('click', handleClaimTickets);
    }
    
    function navigateTo(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId).classList.add('active');
        navButtons.forEach(button => button.classList.toggle('active', button.dataset.page === pageId));
        if (pageId === 'tasks-page') renderTasksPage();
    }
    
    function updateAllUI() {
        pointsValueTop.textContent = Math.floor(user.points).toLocaleString();
        profileNameEl.textContent = user.name;
        profileUsernameEl.textContent = user.username;
        profilePointsEl.textContent = Math.floor(user.points).toLocaleString();
        pullsAmountEl.textContent = user.pulls;
        tonBalanceEl.textContent = user.ton.toFixed(2);
        solBalanceEl.textContent = user.sol.toFixed(4);
    }
    
    function updateButtonStates() {
        if (isSpinning) return;
        if (user.pulls > 0) {
            pullButton.disabled = false;
            watchAdButton.disabled = true;
            resultText.textContent = "PULL THE LEVER!";
        } else {
            pullButton.disabled = true;
            watchAdButton.disabled = false;
            resultText.textContent = "WATCH AD TO PLAY";
        }
    }
    
    function checkDailyResets() {
        const today = getTodayDateString();
        if (user.lastTaskResetDate !== today) {
            user.taskProgress = { pullCount: 0, adWatchCount: 0, jackpotWins: 0, pairWins: 0, pointsWon: 0 };
            user.claimedTasks = [];
            user.lastTaskResetDate = today;
        }
        const lastClaimDate = user.lastStreakClaimDate ? new Date(user.lastStreakClaimDate) : null;
        if (lastClaimDate) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastClaimDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0] && user.lastStreakClaimDate !== today) {
                user.dailyStreak = 0;
            }
        }
        saveUserData();
    }
    
    function getTodayDateString() {
        return new Date().toISOString().split('T')[0];
    }
    
    function renderTasksPage() {
        renderDailyStreak();
        renderDailyTasks();
    }

    function renderDailyStreak() {
        streakContainer.innerHTML = '';
        const today = getTodayDateString();
        STREAK_REWARDS.forEach(reward => {
            const dayEl = document.createElement('div');
            dayEl.className = 'streak-day';
            dayEl.dataset.day = reward.day;
            let rewardText = reward.points ? `🎁 ${reward.points.toLocaleString()}` : `🎟️ ${reward.pulls}`;
            dayEl.innerHTML = `<div class="day-label">Day ${reward.day}</div><div class="day-reward">${rewardText}</div>`;
            if (user.dailyStreak >= reward.day) {
                dayEl.classList.add('claimed');
            } else if (user.dailyStreak + 1 === reward.day && user.lastStreakClaimDate !== today) {
                dayEl.classList.add('active');
                dayEl.onclick = () => claimStreakReward(reward.day);
            }
            streakContainer.appendChild(dayEl);
        });
    }

    function renderDailyTasks() {
        tasksContainer.innerHTML = '';
        DAILY_TASKS.forEach(task => {
            const progress = user.taskProgress[task.progressKey] || 0;
            const isComplete = progress >= task.target;
            const isClaimed = user.claimedTasks.includes(task.id);
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item';
            let rewardText = task.reward.points ? `+${task.reward.points.toLocaleString()} PTS` : `+${task.reward.pulls} Pulls`;
            taskEl.innerHTML = `
                <div class="task-info">
                    <p>${task.description} (${progress}/${task.target})</p>
                    <div class="progress-bar"><div class="progress-bar-inner" style="width: ${Math.min(100, (progress / task.target) * 100)}%;"></div></div>
                </div>
                <div class="task-reward">${rewardText}</div>
                <button class="claim-button" data-task-id="${task.id}" ${(!isComplete || isClaimed) ? 'disabled' : ''}>${isClaimed ? 'Claimed' : 'Claim'}</button>`;
            tasksContainer.appendChild(taskEl);
        });
        document.querySelectorAll('.claim-button').forEach(button => button.addEventListener('click', () => claimTaskReward(button.dataset.taskId)));
    }

    function showFeedback(element, message, type) {
        element.textContent = message;
        element.className = `feedback-message ${type}`;
        setTimeout(() => { element.textContent = ''; element.className = 'feedback-message'; }, 4000);
    }
    
    function claimStreakReward(day) {
        const today = getTodayDateString();
        if (user.lastStreakClaimDate === today || user.dailyStreak + 1 !== day) return;
        const reward = STREAK_REWARDS.find(r => r.day === day);
        if (reward.points) user.points += reward.points;
        if (reward.pulls) user.pulls += reward.pulls;
        user.dailyStreak++;
        user.lastStreakClaimDate = today;
        saveUserData();
        updateAllUI();
        renderTasksPage();
    }

    function claimTaskReward(taskId) {
        if (user.claimedTasks.includes(taskId)) return;
        const task = DAILY_TASKS.find(t => t.id === taskId);
        if (user.taskProgress[task.progressKey] >= task.target) {
            if (task.reward.points) user.points += task.reward.points;
            if (task.reward.pulls) user.pulls += task.reward.pulls;
            user.claimedTasks.push(taskId);
            saveUserData();
            updateAllUI();
            renderTasksPage();
        }
    }
    
    // --- MODIFIED FUNCTION TO SHOW REWARDED AD ---
    function handleWatchAd() {
        watchAdButton.disabled = true;
        watchAdButton.textContent = "LOADING AD...";
        resultText.textContent = "PLEASE WAIT";

        AdController.show().then((result) => {
            console.log('AdsGram ad watched successfully.', result);
            
            // --- REWARD THE USER ---
            user.pulls += 10;
            user.taskProgress.adWatchCount++;
            saveUserData();
            updateAllUI();
            updateButtonStates();
            resultText.textContent = "YOU GOT 10 PULLS!";

        }).catch((result) => {
            console.error('AdsGram ad failed or was skipped.', result);
            resultText.textContent = "AD SKIPPED. NO REWARD.";
            
        }).finally(() => {
            // This runs whether the ad succeeded or failed.
            // Reset the button so the user can try again.
            watchAdButton.disabled = false;
            watchAdButton.textContent = "WATCH AD FOR 10 PULLS";
            updateButtonStates(); // Re-evaluates which button should be active
        });
    }

    // --- REVERTED FUNCTION, NO AD HERE ---
    function handlePull() {
        if (user.pulls <= 0 || isSpinning) return;
        isSpinning = true;
        user.pulls--;
        user.taskProgress.pullCount++;
        saveUserData();
        updateAllUI();
        pullButton.disabled = true;
        watchAdButton.disabled = true;
        resultText.classList.remove('win', 'jackpot');
        resultText.textContent = 'GET READY...';
        reelShutter.classList.add('open');
        setTimeout(() => {
            gachaMachine.classList.add('shake-animation');
            resultText.textContent = 'SPINNING...';
            const finalResults = [];
            reels.forEach((reel, index) => {
                reel.innerHTML = '';
                const newReelItems = buildReel();
                reel.appendChild(newReelItems);
                newReelItems.style.transition = 'none';
                newReelItems.style.transform = 'translateY(0)';
                const finalItem = GACHA_ITEMS[Math.floor(Math.random() * GACHA_ITEMS.length)];
                finalResults.push(finalItem);
                const finalElement = document.createElement('div');
                finalElement.className = 'reel-item';
                finalElement.textContent = finalItem.symbol;
                newReelItems.appendChild(finalElement);
                const stopPosition = (newReelItems.children.length - 1) * REEL_ITEM_HEIGHT;
                setTimeout(() => {
                    newReelItems.style.transition = `transform ${SPIN_DURATION / 1000}s cubic-bezier(0.34, 1.56, 0.64, 1)`;
                    newReelItems.style.transform = `translateY(-${stopPosition}px)`;
                }, 100 + index * 200);
            });
            setTimeout(() => {
                checkWin(finalResults);
                isSpinning = false;
                gachaMachine.classList.remove('shake-animation');
                reelShutter.classList.remove('open');
                updateButtonStates();
            }, SPIN_DURATION + 600);
        }, 500);
    }

    function checkWin(results) {
        const symbols = results.map(r => r.symbol);
        let pointsWon = 0;
        if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
            pointsWon = results[0].points * 10;
            resultText.textContent = `JACKPOT! +${pointsWon}`;
            resultText.classList.add('jackpot');
            user.taskProgress.jackpotWins++;
        } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
            const pairSymbol = symbols[0] === symbols[1] ? symbols[0] : (symbols[0] === symbols[2] ? symbols[0] : symbols[1]);
            pointsWon = results.find(r => r.symbol === pairSymbol).points * 2;
            resultText.textContent = `PAIR! +${pointsWon}`;
            resultText.classList.add('win');
            user.taskProgress.pairWins++;
        } else {
            results.forEach(item => pointsWon += item.points);
            resultText.textContent = `+${pointsWon} PTS`;
            resultText.classList.add('win');
        }
        user.points += pointsWon;
        user.taskProgress.pointsWon += pointsWon;
        saveUserData();
        updateAllUI();
    }

    function buildReel() {
        const reelItems = document.createElement('div');
        reelItems.className = 'reel-items';
        for (let i = 0; i < 50; i++) {
            const item = GACHA_ITEMS[Math.floor(Math.random() * GACHA_ITEMS.length)];
            const div = document.createElement('div');
            div.className = 'reel-item';
            div.textContent = item.symbol;
            reelItems.appendChild(div);
        }
        return reelItems;
    }

    function initializeReels() {
        reels.forEach(reel => { reel.innerHTML = ''; reel.appendChild(buildReel()); });
    }
    
    function handleExchange() {
        const pointsToExchange = parseInt(pointsToExchangeInput.value, 10);
        if (isNaN(pointsToExchange) || pointsToExchange <= 0) return showFeedback(exchangeFeedbackEl, "Please enter a valid number.", "error");
        if (pointsToExchange > user.points) return showFeedback(exchangeFeedbackEl, "You do not have enough points.", "error");
        if (pointsToExchange % POINTS_PER_BLOCK !== 0) return showFeedback(exchangeFeedbackEl, `Exchange in blocks of ${POINTS_PER_BLOCK.toLocaleString()}.`, "error");
        const blocks = pointsToExchange / POINTS_PER_BLOCK;
        const tonGained = blocks * TON_PER_BLOCK;
        const solGained = blocks * SOL_PER_BLOCK;
        user.points -= pointsToExchange;
        user.ton += tonGained;
        user.sol += solGained;
        saveUserData();
        updateAllUI();
        pointsToExchangeInput.value = '';
        showFeedback(exchangeFeedbackEl, `Exchanged for ${tonGained.toFixed(2)} TON & ${solGained.toFixed(4)} SOL!`, "success");
    }

    function handleWithdraw() {
        const currency = cryptoSelect.value;
        const amount = parseFloat(withdrawalAmountInput.value);
        const address = walletAddressInput.value.trim();
        if (isNaN(amount) || amount <= 0) return showFeedback(withdrawalFeedbackEl, "Please enter a valid amount.", "error");
        if (address === '') return showFeedback(withdrawalFeedbackEl, "Please enter a wallet address.", "error");
        const fee = amount * (WITHDRAWAL_FEE_PERCENT / 100);
        const totalDeducted = amount + fee;
        if (currency === 'ton') {
            if (amount < MIN_TON_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum TON withdrawal is ${MIN_TON_WITHDRAWAL}.`, "error");
            if (totalDeducted > user.ton) return showFeedback(withdrawalFeedbackEl, `Insufficient TON. Total needed: ${totalDeducted.toFixed(2)}`, "error");
            user.ton -= totalDeducted;
        } else if (currency === 'sol') {
            if (amount < MIN_SOL_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum SOL withdrawal is ${MIN_SOL_WITHDRAWAL}.`, "error");
            if (totalDeducted > user.sol) return showFeedback(withdrawalFeedbackEl, `Insufficient SOL. Total needed: ${totalDeducted.toFixed(4)}`, "error");
            user.sol -= totalDeducted;
        }
        saveUserData();
        updateAllUI();
        withdrawalAmountInput.value = '';
        walletAddressInput.value = '';
        showFeedback(withdrawalFeedbackEl, `Withdrawal of ${amount.toFixed(4)} ${currency.toUpperCase()} is processing.`, "success");
    }

    // --- START THE APP ---
    initializeApp();
});
