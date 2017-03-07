HOST="127.0.0.1"
BASES="127.0.0.1:39000,127.0.0.1:39001"
OPTS=""

# for demos use OPTS = '--seneca.options.debug.undead=true --seneca.options.plugin.mesh.sneeze.silent=1'


node base/base.js base0 39000 $HOST $BASES $OPTS &
sleep 1
node base/base.js base1 39001 $HOST $BASES $OPTS &
sleep 1
node front/front.js $HOST $BASES $OPTS &
sleep 1
node api/api-service.js 0 $HOST $BASES $OPTS &
sleep 1
node post/post-service.js $HOST $BASES $OPTS &
sleep 1
node entry-store/entry-store-service.js $HOST $BASES $OPTS &
sleep 1
node entry-cache/entry-cache-service.js $HOST $BASES $OPTS &
sleep 1
node repl/repl-service.js 10001 $HOST $HOST $BASES $OPTS &
sleep 1
node mine/mine-service.js 0 $HOST $BASES $OPTS &
sleep 1
node home/home-service.js 0 $HOST $BASES $OPTS &
sleep 1
node search/search-service.js 0 $HOST $BASES $OPTS &
sleep 1
node index/index-service.js $HOST $BASES $OPTS &
sleep 1
node follow/follow-service.js $HOST $BASES $OPTS &
sleep 1
node fanout/fanout-service.js $HOST $BASES $OPTS &
sleep 1
node timeline/timeline-service.js 0 $HOST $BASES $OPTS &
sleep 1
node timeline/timeline-service.js 1 $HOST $BASES $OPTS &
sleep 1
node timeline/timeline-shard-service.js $HOST $BASES $OPTS &
sleep 1
node reserve/reserve-service.js $HOST $BASES $OPTS &





