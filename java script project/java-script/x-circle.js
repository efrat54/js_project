let turn = true; // true = x, false = o
let btns = document.querySelectorAll(".btn")
let currentStartingPlayer = true;// true = x, false = o
let currentPlayers = JSON.parse(localStorage.getItem('currentPlayers'))

//הוספת מאזין לכפתור משחק חדש
document.querySelector("#newGameBtn").addEventListener("click", () => {
    resetGameData()
    startNewGame()
    alert("משחק חדש התחיל!")
})
document.querySelector("#homeBtn").addEventListener("click", () => {
    window.location.href = "homepage.html"
})
btns.forEach(b => {
    b.addEventListener("click", btnClick)
})
// טען את שמות השחקנים ועדכן את הכותרת
document.getElementById("players-header").textContent = `${currentPlayers.username1} vs ${currentPlayers.username2}`
//פונקציה להכנסת איקס או עיגול לטבלה בכל תור
function btnClick() {
    if (this.textContent != "") return
    if (turn) {
        this.textContent = "x"
    } else {
        this.textContent = "o"
    }
    //checkWin
    if(checkWin()){
        setTimeout(()=>{
        alert(this.textContent+" is win")
        updateResults(this.textContent)
        if (isGameOver()) {
            gameover()
        } else {
            startNewGame()
        }
        currentStartingPlayer = !currentStartingPlayer
        turn = currentStartingPlayer  
    },100)
    }else if (isBoardFull()) {
        setTimeout(() => {
            alert("תיקו! הלוח מתאפס")
            updateResults(null)
            if (isGameOver()) {
                gameover()
            } else {
                startNewGame()
            }
            currentStartingPlayer = !currentStartingPlayer
            turn = currentStartingPlayer
        }, 100)
    } else {
        turn = !turn
    }
}
// פונקציה לעדכון צבע כפתורים במצב ניצחון
function changingColor(x) {
    x.forEach(index => {
        btns[index].style.backgroundColor = "khaki"
    })
}
function checkWin(){
    let btns=document.querySelectorAll(".btn")
    if(btns[0].textContent==btns[1].textContent&&btns[1].textContent==btns[2].textContent&&btns[2].textContent!="")
        { changingColor([0, 1, 2])
            return true
        }
    else if(btns[3].textContent==btns[4].textContent&&btns[4].textContent==btns[5].textContent&&btns[5].textContent!="")
        { changingColor([3, 4, 5])
            return true
        }
    else if(btns[6].textContent==btns[7].textContent&&btns[7].textContent==btns[8].textContent&&btns[8].textContent!="")
        { changingColor([6, 7, 8])
            return true
        }
    else if(btns[0].textContent==btns[3].textContent&&btns[3].textContent==btns[6].textContent&&btns[6].textContent!="")
        { changingColor([0, 3, 6])
            return true
        }
    else if(btns[1].textContent==btns[4].textContent&&btns[4].textContent==btns[7].textContent&&btns[7].textContent!="")
        { changingColor([1, 4, 7])
            return true
        }
    else if(btns[2].textContent==btns[5].textContent&&btns[5].textContent==btns[8].textContent&&btns[8].textContent!="")
        { changingColor([2, 5, 8])
            return true
        }
    else if(btns[0].textContent==btns[4].textContent&&btns[4].textContent==btns[8].textContent&&btns[8].textContent!="")
        { changingColor([0, 4, 8])
            return true
        }
    else if(btns[2].textContent==btns[4].textContent&&btns[4].textContent==btns[6].textContent&&btns[6].textContent!="")
        { changingColor([2, 4, 6])
            return true
        }
    else  return false
}
// פונקציה לבדיקה האם הלוח מלא
function isBoardFull() {
    for (let btn of btns) {
        if (btn.textContent == "") {
            return false
        }
    }
    return true
}
// פונקציה לעדכון הנצחונות עבור כל שחקן והדפסת מספר המשחקים הנותרים
function updateResults(winner) {
    let gameCount = parseInt(localStorage.getItem('gameCount'))
    let player1Results = JSON.parse(localStorage.getItem('player1Results'))
    let player2Results = JSON.parse(localStorage.getItem('player2Results'))
    //עדכון התוצאה במערכי המשתמשים
    if (winner == 'x') {
        player2Results[gameCount] = 1
        player1Results[gameCount] = 0
    } else {
        player2Results[gameCount] = 0
        player1Results[gameCount] = 1
    }
    localStorage.setItem('player1Results', JSON.stringify(player1Results))
    localStorage.setItem('player2Results', JSON.stringify(player2Results))
    localStorage.setItem('gameCount', (gameCount + 1).toString())
    alert(`נותרו ${10-gameCount} משחקים`)
}
//בדיקה על כמות המשחקים שנותרו
function isGameOver() {
    return parseInt(localStorage.getItem('gameCount')) >= 11
}
//סיום 11 סיבובים
function gameover() {
    //העברת הנתונים ללוקל סטוריג
    let player1Results = JSON.parse(localStorage.getItem('player1Results'))
    let player2Results = JSON.parse(localStorage.getItem('player2Results'))
    //בדיקה מי השחקן המנצח
    let player1Wins = player1Results.filter(result => result == 1).length
    let player2Wins = player2Results.filter(result => result == 1).length
    let winnerUsername
    if (player1Wins > player2Wins) {
        winnerUsername = currentPlayers.username1
    } else if (player2Wins > player1Wins) {
        winnerUsername = currentPlayers.username2
    } else {
        winnerUsername = "תיקו" 
    }
    // יצירת דיב (מחליף צבעים) חדש להצגת התוצאה
    let resultDiv = document.createElement('div')
    resultDiv.id = 'result'
    resultDiv.textContent = `${winnerUsername} ניצח`
    document.body.insertBefore(resultDiv, document.body.firstChild)
    // שינוי הצבע של הרקע כל חצי שניה
    let colors = ['#f9c1c1', '#f0b8c0', '#f2d3c3', '#c3e0c3', '#c8e0e4']
    let colorIndex = 0
    setInterval(() => {
        resultDiv.style.backgroundColor = colors[colorIndex]
        colorIndex = (colorIndex + 1) % colors.length
    }, 500)
    //הורדת הכותרת אחרי 4 שניות והתחלת משחק חדש   
    setTimeout(() => {
        location.reload() // רענון הדף 
        resetGameData()
        startNewGame()
        alert("משחק חדש התחיל!")
    }, 4000)
    // הוספת בדיקה כדי למנוע שגיאה אם הנתונים לא מוגדרים
    if (currentPlayers) {
        let player1 = users.find(u => u.username == currentPlayers.username1)
        let player2 = users.find(u => u.username == currentPlayers.username2)
        if (player1Wins > player2Wins) {
            player1.wins = (player1.wins || 0) + 1
        } else {
            player2.wins = (player2.wins || 0) + 1
        }
        localStorage.setItem("users", JSON.stringify(users))
    }
    resetGameData(); // קריאה לפונקציה לאתחול הנתונים
}

function startNewGame() {
    btns.forEach(btn => {
        btn.textContent = "" // מנקה את תוכן הכפתור
        btn.style.backgroundColor = "rgb(216, 163, 199)" // עדכון לצבע המקורי  
    });
    turn = true; // מחזיר את התור לשחקן X
}
// פונקציה לאתחול הנתונים לאחר 11 משחקים
function resetGameData() {
    localStorage.setItem('gameCount', '0')
    localStorage.setItem('player1Results', JSON.stringify(Array(11).fill(null)))
    localStorage.setItem('player2Results', JSON.stringify(Array(11).fill(null)))
}