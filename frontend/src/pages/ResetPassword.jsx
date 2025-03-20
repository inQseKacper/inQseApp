function ResetPassword() {
  const { uidb64, token } = useParams(); // Pobranie parametrów z URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Hasła nie są identyczne.");
      return;
    }

    try {
      const res = await api.post(
        `/api/password-reset-confirm/${uidb64}/${token}/`,
        {
          new_password: newPassword,
          confirm_password: confirmPassword,
        }
      );
      setMessage("Hasło zostało zmienione! Możesz się teraz zalogować.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Nie udało się zresetować hasła."
      );
    }
  };

  return (
    <div className="centered-container">
      <h2>Ustaw nowe hasło</h2>

      <form onSubmit={handleSubmit}>
        <a href="https://inqse.com/" target="_blank">
          <img
            src="https://quguse.pl/img/INQSE_logo.png"
            alt="Logo INQSE"
            className="logo"
          />
        </a>

        {message && <p className="success-message">{message}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input
          type="password"
          placeholder="Nowe hasło"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Potwierdź nowe hasło"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button className="register-button request-btn" type="submit">
          Zmień hasło
        </button>
      </form>
    </div>
  );
}

export default ResetPassword
