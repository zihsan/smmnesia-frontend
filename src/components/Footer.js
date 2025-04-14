export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal footer-center bg-base-100 border-t-4 border-black text-base-content p-4 mt-8">
      <aside>
        <p className="text-xs">
          Copyright © {new Date().getFullYear()} - All right reserved by SmmNesia
        </p>
      </aside>
    </footer>
  );
}