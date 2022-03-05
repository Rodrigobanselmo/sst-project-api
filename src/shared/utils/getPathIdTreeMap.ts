export const getPathIdTreeMap = (
  id: number | string,
  nodes: Record<
    string,
    {
      id: number | string;
      parentId: string | number;
      children: (string | number)[];
    }
  >,
) => {
  const path: (string | number)[] = [];

  const loop = (id: number | string) => {
    const node = nodes[id];
    if (node) {
      path.push(node.id);
      if (node.parentId) {
        loop(node.parentId);
      }
    }
  };

  loop(id);
  return path.reverse();
};
