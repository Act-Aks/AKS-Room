const Meeting = ({ params }: { params: { id: string } }) => {
  return <div>Meeting : {params.id}</div>;
};

export default Meeting;
