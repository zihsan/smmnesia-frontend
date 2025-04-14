import Link from "next/link";

const Breadcrumbs = ({ items, className }) => {
  return (
    <div
      className={`py-0 px-4 w-full border-2 border-black text-xs rounded-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${className}`}
    >
      <div className="breadcrumbs text-xs">
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <Link href={item.href}>
                {item.icon}
                <span className="mt-0.5">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Breadcrumbs;