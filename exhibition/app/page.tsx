import { artist, exhibition, peer, statement, works, workAlt, workSrc } from "@/lib/content"
import Biography from "@/components/Biography"
import Gallery from "@/components/Gallery"
import Guestbook from "@/components/Guestbook"
import Share from "@/components/Share"
import GuestbookProvider from "@/components/GuestbookStore"
import { siteUrl } from "@/lib/site"

export default function Home() {
  const cover = works[0]
  return (
    <main className="page">
      {/* 표지 */}
      <header className="cover">
        <h1>
          <span className="n">{exhibition.artistKo}</span>
          <span className="k">개인전</span>
        </h1>
        <span className="en">{exhibition.artistEn}</span>
        <span className="solo">SOLO EXHIBITION</span>
        <span className="ttl" aria-label={exhibition.titlePlain}>
          {exhibition.title}
        </span>
        <figure>
          <img
            src={workSrc(cover)}
            alt={workAlt(cover)}
            width={cover.w}
            height={cover.h}
            fetchPriority="high"
          />
          <figcaption>
            <b>{cover.title}</b> | {cover.year} | {cover.mediumEn} | {cover.size.replace(/ /g, "")}
          </figcaption>
        </figure>
        <div className="when">
          <span className="d">{exhibition.periodShort}</span>
          <span className="v">
            {exhibition.venueKo} {exhibition.venueEn}
          </span>
          <span className="a">{exhibition.address}</span>
        </div>
        <a className="more" href="#statement">
          <span>아래로 넘겨 보세요</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </header>

      <div className="divider" />

      {/* 작가의 말 */}
      <section className="section" id="statement" aria-labelledby="statement-h">
        <span className="eyebrow">작가의 말</span>
        <h2 id="statement-h" className="h2" style={{ fontSize: 24, lineHeight: 1.55, fontWeight: 800 }}>
          {statement.heading.join(" ")}
        </h2>
        {statement.body.map((p, i) => (
          <p key={i} className="body">
            {p}
          </p>
        ))}
        <span style={{ fontSize: 18, fontWeight: 700, alignSelf: "flex-end" }}>— {statement.sign}</span>
      </section>

      <div className="divider" />

      {/* 전시 안내 */}
      <section className="section" id="info" aria-labelledby="info-h">
        <span className="eyebrow">전시 안내</span>
        <h2 id="info-h" className="h2">
          관람 안내
        </h2>
        <dl className="kv">
          <dt>전시명</dt>
          <dd>
            {exhibition.artistKo} 개인전 〈{exhibition.titlePlain}〉
          </dd>
          <dt>기간</dt>
          <dd>{exhibition.periodFull}</dd>
          <dt>시간</dt>
          <dd>{exhibition.hours}</dd>
          <dt>장소</dt>
          <dd>
            {exhibition.venueKo} ({exhibition.venueEn})
            <br />
            {exhibition.address}
          </dd>
          <dt>문의</dt>
          <dd>{exhibition.phone}</dd>
        </dl>
        <div className="btn-row">
          <a className="btn solid" href={exhibition.mapUrl} target="_blank" rel="noopener noreferrer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            지도 보기
          </a>
          <a className="btn" href={`tel:${exhibition.phoneTel}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
            전화하기
          </a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="step">찾아오시는 길</span>
          <ul className="way">
            {exhibition.directions.map((d) => (
              <li key={d.station}>
                <span className="line">{d.line}</span>
                <b>{d.station}</b> {d.exit}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="divider" />

      {/* 작가 소개 */}
      <section className="section" id="artist" aria-labelledby="artist-h">
        <span className="eyebrow">작가 소개</span>
        <div className="artist-head">
          <img className="artist-portrait" src="/artist-portrait.webp" alt={artist.photoAlt} width={260} height={330} loading="lazy" />
          <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            <h2 id="artist-h" className="artist-name" style={{ margin: 0 }}>
              {artist.nameKo}
            </h2>
            <span style={{ fontSize: 17, fontWeight: 500, color: "var(--sub)" }}>{artist.nameEn}</span>
            <span style={{ marginTop: 8, fontSize: 18, fontWeight: 800, color: "var(--red)", lineHeight: 1.45 }}>{artist.tagline}</span>
            <span style={{ marginTop: 4, fontSize: 16, fontWeight: 500, color: "var(--sub)", lineHeight: 1.45 }}>{artist.role}</span>
          </div>
        </div>
        <p className="body">{artist.intro}</p>
        <div className="card">
          <span style={{ fontSize: 18, fontWeight: 800 }}>주요 수상</span>
          <div className="yr">
            {artist.highlights.map((h, i) => (
              <div key={i} style={{ display: "contents" }}>
                <span className="y">{h.y}</span>
                <span>
                  {h.event} <b>{h.prize}</b>
                </span>
              </div>
            ))}
          </div>
        </div>
        <Biography groups={artist.cv} />
      </section>

      <div className="divider" />

      <GuestbookProvider>
        {/* 작품 */}
        <Gallery />

        <div className="divider" />

        {/* 방명록 */}
        <Guestbook />
      </GuestbookProvider>

      {/* 공유 */}
      <Share url={siteUrl()} />

      {/* 동료작가 */}
      <a className="peer" href={peer.url} target="_blank" rel="noopener">
        <span className="eyebrow">{peer.label}</span>
        <span className="who">
          {peer.artist} 개인전 〈{peer.title}〉
        </span>
        <img src={peer.image} alt={`${peer.artist} 작가의 대표작`} loading="lazy" />
        <span className="note">{peer.note}</span>
        <span className="btn solid">{peer.artist} 작가 도록 열기</span>
      </a>

      <footer className="foot">
        © {exhibition.artistKo} · 모든 작품 이미지의 저작권은 작가에게 있습니다
      </footer>
    </main>
  )
}
