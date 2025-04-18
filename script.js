function predictStability() {
    const sequence = document.getElementById("gene-input").value.toUpperCase().trim();
  
    if (!/^[ATCG]*$/.test(sequence) || sequence.length === 0) {
      alert("Please enter a valid gene sequence with A, T, C, G only.");
      return;
    }
  
    function gcContent(seq) {
      const gc = (seq.match(/[GC]/g) || []).length;
      return (gc / seq.length) * 100;
    }
  
    function tm(seq) {
      const at = (seq.match(/[AT]/g) || []).length;
      const gc = (seq.match(/[GC]/g) || []).length;
      return seq.length < 50 ? (2 * at + 4 * gc) : (64.9 + 41 * (gc - 16.4) / seq.length);
    }
  
    function isRepetitive(seq) {
      let score = 0;
      for (let i = 0; i <= seq.length - 6; i++) {
        const sub = seq.substring(i, i + 6);
        const occ = seq.split(sub).length - 1;
        if (occ > 1) score += occ - 1;
      }
      return score > 5;
    }
  
    function hasPalindrome(seq) {
      const comp = { A: 'T', T: 'A', C: 'G', G: 'C' };
      for (let i = 0; i <= seq.length - 8; i++) {
        const sub = seq.substring(i, i + 8);
        const rev = sub.split('').reverse().map(c => comp[c]).join('');
        if (sub === rev) return true;
      }
      return false;
    }
  
    function dinucleotideBias(seq) {
      const cpg = (seq.match(/CG/g) || []).length;
      const at = (seq.match(/AT|TA/g) || []).length;
      return cpg / (seq.length - 1) > 0.2 || at / (seq.length - 1) > 0.4;
    }
  
    function hasHairpin(seq) {
      const comp = { A: 'T', T: 'A', C: 'G', G: 'C' };
      for (let i = 0; i < seq.length - 9; i++) {
        const stem1 = seq.substring(i, i + 4);
        for (let j = i + 5; j < seq.length - 4; j++) {
          const stem2 = seq.substring(j, j + 4).split('').reverse().map(c => comp[c]).join('');
          if (stem1 === stem2) return true;
        }
      }
      return false;
    }
  
    let report = [];
    let risk = 0;
  
    const gc = gcContent(sequence);
    const melting = tm(sequence);
  
    if (gc >= 40 && gc <= 60) report.push(`✅ GC content (${gc.toFixed(1)}%) is in stable range.`);
    else { report.push(`⚠️ GC content (${gc.toFixed(1)}%) is outside stable range.`); risk++; }
  
    if (melting >= 50 && melting <= 80) report.push(`✅ Melting temp (${melting.toFixed(1)}°C) is stable.`);
    else { report.push(`⚠️ Melting temp (${melting.toFixed(1)}°C) is unstable.`); risk++; }
  
    if (isRepetitive(sequence)) { report.push("⚠️ High repetition detected."); risk++; }
    else report.push("✅ No significant repetition.");
  
    if (hasPalindrome(sequence)) { report.push("⚠️ Palindromic sequence found."); risk++; }
    else report.push("✅ No palindrome issues.");
  
    if (dinucleotideBias(sequence)) { report.push("⚠️ Dinucleotide bias detected."); risk++; }
    else report.push("✅ Dinucleotide ratios are normal.");
  
    if (hasHairpin(sequence)) { report.push("⚠️ Hairpin-forming region found."); risk++; }
    else report.push("✅ No hairpin-forming regions.");
  
    if (sequence.length < 20) { report.push("⚠️ Very short sequence (<20 bases)."); risk++; }
    else report.push(`✅ Sequence length is ${sequence.length} bases.`);
  
    let prediction = risk === 0 ? "Stable" : risk <= 2 ? "Moderately Stable" : "Unstable";
    report.unshift(`🔬 Prediction: ${prediction}\n`);
  
    localStorage.setItem("prediction", report.join("\n"));
    window.location.href = "result.html";
  }
  