import './Header.css'

export const Header = () => {
    return (
        <div className=''>
            <div>
                <img src='/images/logo.png' alt="Logo" />
                <p>Logo</p>
                <p>Logo</p>
            </div>
            <div>
                <div>
                    <span></span>
                    <p>+998 71 789 78 78</p>
                </div>
                <div>
                    <span></span>
                    <p>info@name-com.uz</p>
                </div>
                <div>
                    <a href='#'>Telegram</a>
                    <a href='#'>Whatsapp</a>
                    <select>
                        <option value=''>Русский</option>
                        <option value=''>Английский</option>
                        <option value=''>Узбекский</option>
                    </select>

                </div>
            </div>
        </div>
    )
}