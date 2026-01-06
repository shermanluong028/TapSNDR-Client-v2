import Header from "../components/layout/Header";

interface BaseLayoutProps {
  onHeaderBarClicked: React.MouseEventHandler,
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ onHeaderBarClicked, children }) => (
  <div className="w-full h-full flex flex-col">
    <Header onBarClicked={onHeaderBarClicked} />
    <div className="mt-[60px]">
      {children}
    </div>
  </div>
);
