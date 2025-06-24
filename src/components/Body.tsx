export const Body = (props) => {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0 min-h-[100vh]">
      {props.children}
    </div>
  );
};
