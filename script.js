.cat-container {
  width: 200px;
  height: 150px;
  margin: 10px auto 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent; /* 背景を透明に */
  border-radius: 0; /* 角丸を削除 */
  border-bottom: none; /* 下線を削除 */
}

#catImage {
  width: 180px; /* 画像サイズ調整 */
  height: auto;
  transition: all 0.5s ease;
  object-fit: contain; /* アスペクト比を保持 */
}
