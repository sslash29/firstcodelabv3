function Groups({ groupList }) {
  return (
    <div>
      {groupList.map((group, index) => {
        return <p key={index}>{group}</p>;
      })}
    </div>
  );
}

export default Groups;
