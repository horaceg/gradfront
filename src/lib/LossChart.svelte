<script>
	import * as vl from 'vega-lite-api';

	export let losses;
	let loss_data = losses.map((l, i) => ({ step: i, loss: l }));
	let loss_chart = vl
		.markLine()
		.data(loss_data)
		.encode(vl.x().fieldQ('step'), vl.y().fieldQ('loss'))
		.width(600);

	embed('#vis', loss_chart, { actions: false }).catch((error) => console.log(error));
</script>
