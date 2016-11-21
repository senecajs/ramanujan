BASES="127.0.0.1:39000,127.0.0.1:39001"
OPTS=""

node base/base.js base0 39000 $BASES $OPTS &
sleep 1
node base/base.js base1 39001 $BASES $OPTS &
sleep 1
node front/front.js $BASES $OPTS &
sleep 1
node api/api-service.js 0 $BASES $OPTS &
sleep 1
node post/post-service.js $BASES $OPTS &
sleep 1
node entry-store/entry-store-service.js $BASES $OPTS &
sleep 1
node entry-cache/entry-cache-service.js $BASES $OPTS &
sleep 1
node repl/repl-service.js 10001 $BASES $OPTS &
sleep 1
node mine/mine-service.js 0 $BASES $OPTS &
sleep 1
node home/home-service.js 0 $BASES $OPTS &
sleep 1
node search/search-service.js 0 $BASES $OPTS &
sleep 1
node index/index-service.js $BASES $OPTS &
sleep 1
node follow/follow-service.js $BASES $OPTS &
sleep 1
node fanout/fanout-service.js $BASES $OPTS &
sleep 1
node timeline/timeline-service.js 0 $BASES $OPTS &
sleep 1
node timeline/timeline-service.js 1 $BASES $OPTS &
sleep 1
node timeline/timeline-shard-service.js $BASES $OPTS &
sleep 1
node reserve/reserve-service.js $BASES $OPTS &





