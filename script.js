document.addEventListener('DOMContentLoaded', () => {
    // Check if Telegram Web App SDK is available
    if (typeof window.Telegram === 'undefined' || typeof window.Telegram.WebApp === 'undefined') {
        console.warn("Telegram Web App SDK not found. Running in standalone fallback mode.");
    }
    
    // =================================================================
    // --- SUPABASE CLIENT INITIALIZATION ---
    // =================================================================
    const SUPABASE_URL = 'https://vddnlobgtnwwplburlja.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkZG5sb2JndG53d3BsYnVybGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NDEyMTcsImV4cCI6MjA3NTUxNzIxN30.2zYyICX5QyNDcLcGWia1F04yXPfNH6M09aczNlsLFSM';
    // CORRECTED: Use window.supabase which is loaded from the CDN script
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // =================================================================
    // --- ADSGRAM SDK INITIALIZATION ---
    // =================================================================
    const AdController = window.Adsgram ? window.Adsgram.init({ blockId: "int-14190" }) : { show: () => Promise.reject('Adsgram stubbed') };

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
    // This now matches the task_key in your database
    const DAILY_TASK_KEYS = ['pull10', 'watch2', 'winPair', 'earn10k', 'winJackpot'];
    const TREASURE_COOLDOWN = 3 * 60 * 1000; // 3 minutes
    const TREASURE_REWARD_POINTS = 2000;
    const TICKET_COOLDOWN = 5 * 60 * 1000; // 5 minutes
    const TICKET_REWARD_PULLS = 10;
    
    // =================================================================
    // --- STATE MANAGEMENT ---
    // =================================================================
    let user = {}; // Will hold profile data from Supabase
    let tasks = {}; // Will hold task definitions from Supabase
    let taskProgress = {}; // Will hold today's task progress
    let isSpinning = false;
    
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
    // --- SUPABASE DATA PERSISTENCE ---
    // =================================================================
    async function loadUserData(telegramUser) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('telegram_id', telegramUser.id)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error("Error fetching profile:", error);
            return;
        }

        if (data) {
            user = data;
            console.log(`Loaded profile for user ID: ${user.telegram_id}`);
        } else {
            const { data: newUser, error: createError } = await supabase
                .from('profiles')
                .insert({
                    telegram_id: telegramUser.id,
                    username: telegramUser.username ? '@' + telegramUser.username : 'No Username',
                    full_name: telegramUser.first_name + (telegramUser.last_name ? ' ' + telegramUser.last_name : ''),
                    points: 1250 // Starting points
                })
                .select()
                .single();

            if (createError) {
                console.error("Error creating profile:", createError);
                return;
            }
            user = newUser;
            console.log(`Created new profile for user ID: ${user.telegram_id}`);
        }
        await fetchTasksAndProgress();
    }
    
    async function fetchTasksAndProgress() {
        const { data: taskDefs, error: taskError } = await supabase.from('tasks').select('*');
        if (taskError) return console.error("Error fetching tasks:", taskError);
        
        tasks = taskDefs.reduce((acc, task) => {
            acc[task.task_key] = task;
            return acc;
        }, {});

        const today = getTodayDateString();
        const { data: progress, error: progressError } = await supabase
            .from('user_task_progress')
            .select('*, tasks(task_key)')
            .eq('user_id', user.id)
            .eq('date', today);
        
        if (progressError) return console.error("Error fetching task progress:", progressError);

        taskProgress = progress.reduce((acc, p) => {
            acc[p.tasks.task_key] = p;
            return acc;
        }, {});
    }
    
    async function updateUserProfile(updateData) {
        const { data: updatedUser, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', user.id)
            .select()
            .single();
            
        if (error) {
            console.error("Error updating profile:", error);
        } else {
            user = updatedUser; // Update local user object with the fresh data from DB
        }
    }

    async function updateTaskProgress(taskKey, incrementValue = 1) {
        if (!tasks[taskKey]) return;

        const taskId = tasks[taskKey].id;
        const currentProg = taskProgress[taskKey]?.current_progress || 0;
        const newProgress = currentProg + incrementValue;

        const { data, error } = await supabase
            .from('user_task_progress')
            .upsert({
                user_id: user.id,
                task_id: taskId,
                date: getTodayDateString(),
                current_progress: newProgress,
                is_claimed: taskProgress[taskKey]?.is_claimed || false 
            }, { onConflict: 'user_id, task_id, date' })
            .select(`*, tasks(task_key)`)
            .single();

        if (error) {
            console.error(`Error updating progress for ${taskKey}:`, error);
        } else {
            taskProgress[data.tasks.task_key] = data;
        }
    }

    // =================================================================
    // --- INITIALIZATION ---
    // =================================================================
    async function initTelegram() {
        const TWA = window.Telegram.WebApp;
        TWA.ready();
        TWA.expand();
        document.body.style.backgroundColor = TWA.themeParams.bg_color || '#1a1a2e';

        const initData = TWA.initDataUnsafe;
        let telegramUser;

        if (initData && initData.user) {
            telegramUser = initData.user;
        } else {
            console.warn("Telegram user data not found. Using fallback user.");
            telegramUser = { id: 999999, first_name: 'Dev', last_name: 'Tester', username: 'dev_user' };
        }
        
        await loadUserData(telegramUser);
        initializeApp();
    }
    
    function initializeApp() {
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
        const lastTreasureClaim = user.last_treasure_claim ? new Date(user.last_treasure_claim).getTime() : 0;
        const treasureCooldownEnd = lastTreasureClaim + TREASURE_COOLDOWN;
        if (now < treasureCooldownEnd) {
            treasureTimerEl.textContent = formatTime(treasureCooldownEnd - now);
            treasureClaimBtn.disabled = true;
        } else {
            treasureTimerEl.textContent = `+${TREASURE_REWARD_POINTS.toLocaleString()} Pts`;
            treasureClaimBtn.disabled = false;
        }

        const lastTicketClaim = user.last_ticket_claim ? new Date(user.last_ticket_claim).getTime() : 0;
        const ticketCooldownEnd = lastTicketClaim + TICKET_COOLDOWN;
        if (now < ticketCooldownEnd) {
            ticketTimerEl.textContent = formatTime(ticketCooldownEnd - now);
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

    async function handleClaimTreasure() {
        if (treasureClaimBtn.disabled) return;
        treasureClaimBtn.disabled = true;
        
        await updateUserProfile({
            points: user.points + TREASURE_REWARD_POINTS,
            last_treasure_claim: new Date().toISOString()
        });
        
        updateAllUI();
        updateTimedRewards();
    }

    async function handleClaimTickets() {
        if (ticketClaimBtn.disabled) return;
        ticketClaimBtn.disabled = true;

        await updateUserProfile({
            pulls: user.pulls + TICKET_REWARD_PULLS,
            last_ticket_claim: new Date().toISOString()
        });

        updateAllUI();
        updateButtonStates();
        updateTimedRewards();
    }

    // =================================================================
    // --- CORE APP LOGIC ---
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
        if (!user || !user.id) return; // Prevent UI updates if user data isn't loaded
        pointsValueTop.textContent = Math.floor(user.points).toLocaleString();
        profileNameEl.textContent = user.full_name;
        profileUsernameEl.textContent = user.username;
        profilePointsEl.textContent = Math.floor(user.points).toLocaleString();
        pullsAmountEl.textContent = user.pulls;
        tonBalanceEl.textContent = parseFloat(user.ton_balance).toFixed(2);
        solBalanceEl.textContent = parseFloat(user.sol_balance).toFixed(4);
    }
    
    function updateButtonStates() {
        if (isSpinning || !user.id) return;
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
    
    async function checkDailyResets() {
        const today = getTodayDateString();
        const lastClaimDateStr = user.last_streak_claim_date;
        if (lastClaimDateStr && lastClaimDateStr !== today) {
            const lastClaimDate = new Date(lastClaimDateStr);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastClaimDate.toISOString().split('T')[0] !== yesterday.toISOString().split('T')[0]) {
                await updateUserProfile({ daily_streak: 0 });
            }
        }
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
            if (user.daily_streak >= reward.day) {
                dayEl.classList.add('claimed');
            } else if (user.daily_streak + 1 === reward.day && user.last_streak_claim_date !== today) {
                dayEl.classList.add('active');
                dayEl.onclick = () => claimStreakReward(reward.day);
            }
            streakContainer.appendChild(dayEl);
        });
    }

    function renderDailyTasks() {
        tasksContainer.innerHTML = '';
        DAILY_TASK_KEYS.forEach(taskKey => {
            const task = tasks[taskKey];
            if (!task) return; // Skip if task definition not loaded yet
            
            const progress = taskProgress[task.task_key]?.current_progress || 0;
            const isClaimed = taskProgress[task.task_key]?.is_claimed || false;
            const isComplete = progress >= task.target_value;

            const taskEl = document.createElement('div');
            taskEl.className = 'task-item';
            let rewardText = task.reward_type === 'points' 
                ? `+${task.reward_amount.toLocaleString()} PTS` 
                : `+${task.reward_amount} Pulls`;

            taskEl.innerHTML = `
                <div class="task-info">
                    <p>${task.description} (${progress}/${task.target_value})</p>
                    <div class="progress-bar"><div class="progress-bar-inner" style="width: ${Math.min(100, (progress / task.target_value) * 100)}%;"></div></div>
                </div>
                <div class="task-reward">${rewardText}</div>
                <button class="claim-button" data-task-key="${task.task_key}" ${(!isComplete || isClaimed) ? 'disabled' : ''}>${isClaimed ? 'Claimed' : 'Claim'}</button>`;
            tasksContainer.appendChild(taskEl);
        });
        tasksContainer.querySelectorAll('.claim-button').forEach(button => button.addEventListener('click', (e) => claimTaskReward(e.currentTarget.dataset.taskKey)));
    }

    function showFeedback(element, message, type) {
        element.textContent = message;
        element.className = `feedback-message ${type}`;
        setTimeout(() => { element.textContent = ''; element.className = 'feedback-message'; }, 4000);
    }
    
    async function claimStreakReward(day) {
        const today = getTodayDateString();
        if (user.last_streak_claim_date === today || user.daily_streak + 1 !== day) return;
        
        const reward = STREAK_REWARDS.find(r => r.day === day);
        let updateData = {
            daily_streak: user.daily_streak + 1,
            last_streak_claim_date: today,
            points: user.points + (reward.points || 0),
            pulls: user.pulls + (reward.pulls || 0)
        };

        await updateUserProfile(updateData);
        updateAllUI();
        renderTasksPage();
    }

    async function claimTaskReward(taskKey) {
        const progressData = taskProgress[taskKey];
        if (!progressData || progressData.is_claimed) return;

        const taskDef = tasks[taskKey];
        if (progressData.current_progress >= taskDef.target_value) {
            let profileUpdate = {};
            if (taskDef.reward_type === 'points') profileUpdate.points = user.points + taskDef.reward_amount;
            else if (taskDef.reward_type === 'pulls') profileUpdate.pulls = user.pulls + taskDef.reward_amount;
            
            await updateUserProfile(profileUpdate);

            const { data: updatedProgress, error } = await supabase
                .from('user_task_progress')
                .update({ is_claimed: true })
                .eq('id', progressData.id)
                .select('*, tasks(task_key)')
                .single();

            if (error) console.error("Error claiming task:", error);
            else {
                taskProgress[updatedProgress.tasks.task_key] = updatedProgress;
                updateAllUI();
                renderTasksPage();
            }
        }
    }
    
    function handleWatchAd() {
        watchAdButton.disabled = true;
        watchAdButton.textContent = "LOADING AD...";
        resultText.textContent = "PLEASE WAIT";

        AdController.show().then(async () => {
            await updateUserProfile({ pulls: user.pulls + 10 });
            await updateTaskProgress('watch2');
            updateAllUI();
            resultText.textContent = "YOU GOT 10 PULLS!";
        }).catch(() => {
            resultText.textContent = "AD FAILED. NO REWARD.";
        }).finally(() => {
            watchAdButton.disabled = false;
            watchAdButton.textContent = "WATCH AD FOR 10 PULLS";
            updateButtonStates();
            renderTasksPage();
        });
    }

    async function handlePull() {
        if (user.pulls <= 0 || isSpinning) return;
        isSpinning = true;
        
        await updateUserProfile({ pulls: user.pulls - 1 });
        await updateTaskProgress('pull10');

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
            setTimeout(async () => {
                await checkWin(finalResults);
                isSpinning = false;
                gachaMachine.classList.remove('shake-animation');
                reelShutter.classList.remove('open');
                updateButtonStates();
            }, SPIN_DURATION + 600);
        }, 500);
    }

    async function checkWin(results) {
        const symbols = results.map(r => r.symbol);
        let pointsWon = 0; let isJackpot = false; let isPair = false;

        if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
            pointsWon = results[0].points * 10;
            resultText.textContent = `JACKPOT! +${pointsWon}`;
            resultText.classList.add('jackpot');
            isJackpot = true;
        } else if (symbols[0] === symbols[1] || symbols[1] === symbols[2] || symbols[0] === symbols[2]) {
            const pairSymbol = symbols[0] === symbols[1] ? symbols[0] : (symbols[0] === symbols[2] ? symbols[0] : symbols[1]);
            pointsWon = results.find(r => r.symbol === pairSymbol).points * 2;
            resultText.textContent = `PAIR! +${pointsWon}`;
            resultText.classList.add('win');
            isPair = true;
        } else {
            results.forEach(item => pointsWon += item.points);
            resultText.textContent = `+${pointsWon} PTS`;
            resultText.classList.add('win');
        }

        await updateUserProfile({ points: user.points + pointsWon });
        await updateTaskProgress('earn10k', pointsWon);
        if (isJackpot) await updateTaskProgress('winJackpot');
        if (isPair) await updateTaskProgress('winPair');
        
        updateAllUI();
        renderTasksPage();
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
    
    async function handleExchange() {
        const pointsToExchange = parseInt(pointsToExchangeInput.value, 10);
        if (isNaN(pointsToExchange) || pointsToExchange <= 0) return showFeedback(exchangeFeedbackEl, "Please enter a valid number.", "error");
        if (pointsToExchange > user.points) return showFeedback(exchangeFeedbackEl, "You do not have enough points.", "error");
        if (pointsToExchange % POINTS_PER_BLOCK !== 0) return showFeedback(exchangeFeedbackEl, `Exchange in blocks of ${POINTS_PER_BLOCK.toLocaleString()}.`, "error");
        
        const blocks = pointsToExchange / POINTS_PER_BLOCK;
        const tonGained = blocks * TON_PER_BLOCK;
        const solGained = blocks * SOL_PER_BLOCK;
        
        await updateUserProfile({
            points: user.points - pointsToExchange,
            ton_balance: parseFloat(user.ton_balance) + tonGained,
            sol_balance: parseFloat(user.sol_balance) + solGained
        });

        await supabase.from('transaction_logs').insert({ user_id: user.id, transaction_type: 'exchange', points_exchanged: pointsToExchange, status: 'completed' });

        updateAllUI();
        pointsToExchangeInput.value = '';
        showFeedback(exchangeFeedbackEl, `Exchanged for ${tonGained.toFixed(2)} TON & ${solGained.toFixed(4)} SOL!`, "success");
    }

    async function handleWithdraw() {
        const currency = cryptoSelect.value;
        const amount = parseFloat(withdrawalAmountInput.value);
        const address = walletAddressInput.value.trim();
        
        if (isNaN(amount) || amount <= 0) return showFeedback(withdrawalFeedbackEl, "Please enter a valid amount.", "error");
        if (address === '') return showFeedback(withdrawalFeedbackEl, "Please enter a wallet address.", "error");

        let newBalance;
        if (currency === 'ton') {
            if (amount < MIN_TON_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum TON withdrawal is ${MIN_TON_WITHDRAWAL}.`, "error");
            if (amount > user.ton_balance) return showFeedback(withdrawalFeedbackEl, `Insufficient TON balance.`, "error");
            newBalance = { ton_balance: parseFloat(user.ton_balance) - amount };
        } else if (currency === 'sol') {
            if (amount < MIN_SOL_WITHDRAWAL) return showFeedback(withdrawalFeedbackEl, `Minimum SOL withdrawal is ${MIN_SOL_WITHDRAWAL}.`, "error");
            if (amount > user.sol_balance) return showFeedback(withdrawalFeedbackEl, `Insufficient SOL balance.`, "error");
            newBalance = { sol_balance: parseFloat(user.sol_balance) - amount };
        }
        
        await updateUserProfile(newBalance);

        await supabase.from('transaction_logs').insert({ user_id: user.id, transaction_type: 'withdrawal', currency: currency.toUpperCase(), amount: amount, withdrawal_address: address, status: 'pending' });

        updateAllUI();
        withdrawalAmountInput.value = '';
        walletAddressInput.value = '';
        showFeedback(withdrawalFeedbackEl, `Withdrawal request of ${amount} ${currency.toUpperCase()} submitted for processing.`, "success");
    }

    // --- START THE APP ---
    initTelegram();
});
