"use client";

import { useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (response.ok) {
      window.location.reload();
      return;
    }
    setMessage("비밀번호를 확인해주세요.");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] p-5">
      <section className="w-full max-w-sm rounded-md border border-stone-300 bg-white p-5 shadow-sm">
        <h1 className="text-xl font-black">관리자 로그인</h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">템플릿 설정은 관리자만 변경할 수 있습니다.</p>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") login();
          }}
          className="mt-4 w-full rounded-md border border-stone-300 px-3 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
          placeholder="관리자 비밀번호"
        />
        {message && <div className="mt-3 text-sm text-red-600">{message}</div>}
        <button type="button" onClick={login} className="mt-4 w-full rounded-md bg-stone-950 px-4 py-3 font-bold text-white">
          로그인
        </button>
      </section>
    </main>
  );
}
