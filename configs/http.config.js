module.exports = {
    "success" : 1,

    "bad_request":          { code: 100, message: "Data Fields Are Require." },
    "login_failed":         { code: 110, message: "Login Failed" },
    "too_many_request":     { code: 120, message: "Too Many Request" },
    "user_not_found":       { code: 130, message: "User Does Not Exist." },
    "already_exist":        { code: 140, message: "Already Exist." },
    "not_allow":            { code: 150, message: "Not Allow." },
    "token_not_found":      { code: 160, message: "Access Token Not Found" },
    "token_expired":        { code: 170, message: "Access Token Expired" },
    "server_error":         { code: 180, message: "Server Error! Something went wrong." },
    "not_found":            { code: 190, message: "Not Found." },
    "user_already_exist":   { code: 210, message: "User Already Exist." },
    "request_not_found":    { code: 220, message: "Request Not Found." },
    "unauthenticated_user": { code: 230, message: "Unauthenticated User." },
    "token_malform":        { code: 230, message: "Token Malformed." },
    "already_logged_out":   { code: 240, message: "Already Logged Out" },

}
