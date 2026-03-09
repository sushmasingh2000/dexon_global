export const swalObj = (walletAddress) => {
    return {
        title: '<strong style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.8rem;">My Dapp Address</strong>',
        html: `
    <div style="margin: 20px 0;">
      <div style="
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 15px 20px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        margin: 10px 0;
      ">
        <code style="
          color: white;
          font-family: 'Courier New', monospace;
          font-size: 0.95rem;
          word-break: break-all;
        ">${walletAddress}</code>
      </div>
      <button onclick="navigator.clipboard.writeText('${walletAddress}')" style="
        background: transparent;
        border: 2px solid #667eea;
        color: #667eea;
        padding: 8px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 10px;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='#667eea'; this.style.color='white'" 
         onmouseout="this.style.background='transparent'; this.style.color='#667eea'">
        📋 Copy Address
      </button>
    </div>
  `,
        showConfirmButton: true,
        confirmButtonText: 'Close',
        confirmButtonColor: '#667eea',
        background: '#fff',
        backdrop: 'rgba(0, 0, 0, 0.4)',
        customClass: {
            popup: 'rounded-popup',
            confirmButton: 'custom-confirm-btn'
        },
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }
}

