<script>
	import { default as vegaEmbed } from 'vega-embed';

	export let losses;
	$: loss_data = losses.map((l, i) => ({ step: i, loss: l }))

	$: loss_chart_json = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		description: 'Loss over time',
		data: { values: loss_data },
		mark: 'line',
		encoding: {
			x: { field: 'step', type: 'quantitative' },
			y: {
				field: 'loss',
				type: 'quantitative',
				scale: {
					domain: [0, 10]
				}
			}
		},
		width: 600,
		height: 400
	};

	$: vegaEmbed('#viz', loss_chart_json, { actions: false }).catch((error) => console.log(error));
</script>
