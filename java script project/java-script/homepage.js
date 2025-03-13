document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault()
    let user = {
        username1: document.querySelector("#username1").value,
        password1: document.querySelector("#password1").value,
        username2: document.querySelector("#username2").value,
        password2: document.querySelector("#password2").value
    }
    let userNames = localStorage.getItem("users")
    let user1 = {
        username: user.username1,
        password: user.password1
    }
    let user2 = {
        username: user.username2,
        password: user.password2
    }
    if (!validateInputs(user.username1, user.password1, user.username2, user.password2)) {
        return
    }
    if (userNames) {
        users = JSON.parse(userNames);
    } else {
        users = []
    }
    // קריאה לפונקציה שבודקת אם שמות המשתמשים קיימים במערך
    if (checking(users, user1) == 1 && checking(users, user2) == 1) {
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem('currentPlayers', JSON.stringify({ username1: user.username1, username2: user.username2 })); // שמירה על המשתמשים הנוכחיים
        window.location.href = "x-circle.html" // מעבר לעמוד המשחק
    } else {
        alert("אחד השחקנים נכשל באימות")
    }
    function validateInputs(username1, password1, username2, password2) {
        if (!username1 || !password1 || !username2 || !password2) {
            alert("כל השדות הם חובה. יש למלא את כל השדות.")
            return false
        }
        if (username1.length < 3 || username2.length < 3) {
            alert("שם המשתמש חייב לכלול לפחות 3 תווים.")
            return false
        }
        if (password1.length < 4 || password1.length > 8 || password2.length < 4 || password2.length > 8) {
            alert("הסיסמה חייבת לכלול בין 4 ל-8 תווים.")
            return false
        }
        return true
    }
})

// פונקציה להוספת משתמש חדש למערך
function adding(users, player) {
    users.push(player)
    users = sortUsers(users)
    localStorage.setItem("users", JSON.stringify(users))
}
// פונקציה לבדיקת משתמש וסיסמה
function checking(users, player) {
    let user = users.find(u => u.username == player.username)
    if (user) {
        return user.password == player.password ? 1 : 0
    } else {
        adding(users, player)
        return 1
    }
}
function sortUsers(users) {
    return users.sort((a, b) => a.username.localeCompare(b.username))
}
//אתחול נתוני המשתמשים בכל משחק חדש
localStorage.setItem('gameCount', '0')
localStorage.setItem('player1Results', JSON.stringify(Array(11).fill(null)))
localStorage.setItem('player2Results', JSON.stringify(Array(11).fill(null)))
//מאזין באמצעות אירועי פוקוס ובלור ע"מ לשנות את צבע גבול השדות
document.querySelectorAll("input").forEach(input => {
    input.addEventListener("focus", (event) => {
        event.target.style.border = '2px solid #66b3ff'; // צבע תכלת
    })
    input.addEventListener("blur", (event) => {
        event.target.style.border = ''
    })
})