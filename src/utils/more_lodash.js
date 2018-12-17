import _ from 'lodash';


// SELECT a.*, b.* FROM listA a LEFT JOIN listB b ON a.propA = b.propB
const join = (listA, propA, listB, propB) => {
  const lookup = _
    .chain(listB)
    .groupBy(rowB => rowB[propB])
    .value();

  return _
    .chain(listA)
    .map(rowA => lookup[rowA[propA]].map((rowB) => { return { ...rowB, ...rowA }; }))
    .flatten()
    .value();
};

_.mixin({ join: join });


export default _;
