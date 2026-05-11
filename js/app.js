const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl("devnet"),
  "confirmed"
);

async function pay() {
  const provider = window.solana;

  if (!provider) {
    alert("Connect wallet first");
    return;
  }

  const amount = parseFloat(document.getElementById("amount").value);
  if (!amount) {
    alert("Enter amount");
    return;
  }

  const fromPubkey = provider.publicKey;
  const toPubkey = provider.publicKey; // replace with merchant later

  const lamports = amount * solanaWeb3.LAMPORTS_PER_SOL;

  const transaction = new solanaWeb3.Transaction().add(
    solanaWeb3.SystemProgram.transfer({
      fromPubkey,
      toPubkey,
      lamports
    })
  );

  transaction.feePayer = fromPubkey;

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;

  const signed = await provider.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signed.serialize());

  await connection.confirmTransaction(signature);

  document.getElementById("status").innerText =
    "✅ Success: " + signature;
}
