exports.convert = ({ cache }) => ({
  key: cache.key,
  value: cache.value,
  createdDate: cache.createdDate,
  updatedDate: cache.updatedDate,
  lastHit: cache.lastHit,
  ttl: cache.ttl,
});
