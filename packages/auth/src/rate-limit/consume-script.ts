// Check and increment together: concurrent serverless instances share one budget.
// Denied requests do not extend the window.
export const CONSUME_SCRIPT = `
local count = tonumber(redis.call('GET', KEYS[1]) or '0')
local ttl = redis.call('PTTL', KEYS[1])
if ttl <= 0 then
  redis.call('SET', KEYS[1], 1, 'PX', ARGV[1])
  return {1, 0}
end
if count >= tonumber(ARGV[2]) then
  return {0, math.ceil(ttl / 1000)}
end
redis.call('INCR', KEYS[1])
return {1, 0}
`;
