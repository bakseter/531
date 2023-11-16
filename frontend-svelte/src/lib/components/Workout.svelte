<script lang="ts">
  import type { Week, Day, BaseWeights } from '$lib/types';
  import {
    weekToPercentages,
    weekToSetReps,
    weekToDefiningRep,
    percentageToText,
    exerciseToText,
    dayToExercise
  } from '$lib/utils';

  const indexToHeading = (i: number): string | undefined => {
    if (i === 0) return 'Warmup';
    if (i === 3) return 'Main sets';
    if (i === 6) return 'Joker sets';
  };

  export let baseWeights: BaseWeights;
  export let cycle: number;
  export let week: Week;
  export let day: Day;
  export let jokersWeightAdd;
  export let weekPercents = weekToPercentages(week, jokersWeightAdd).map((percentage, index) => ({
    index,
    percentage,
    headingText: indexToHeading(index)
  }));
  export const warmupCutOff = 2;
  export const jokerCutOff = 5;
  export const reps = (index: number): number | undefined => weekToSetReps(week)[index];
  export const roundToNearest = (index: number): number => (index <= warmupCutOff ? 5 : 2.5);
  export const tableRowStyle = 'p-2';
  export const tableRowStyleAlt = '{tableRowStyle} bg-slate-200';
</script>

<div>
  <div class="grid grid-flow-col items-center">
    <h3 class="font-bold my-2 inline">{exerciseToText(dayToExercise(day))}</h3>
    <div class="my-2">
      date {cycle}
    </div>
  </div>
  <div class="grid grid-cols-1 items-center">
    <table class="border-collapse border-spacing-2 border border-slate-400 table-auto">
      <thead>
        <tr class="border border-slate-400">
          <th class={tableRowStyle}>Sets</th>
          <th class={tableRowStyle}>Percent</th>
          <th class={tableRowStyle}>Weight</th>
          <th class={tableRowStyle}>Actual</th>
        </tr>
      </thead>
      <tbody>
        {#each weekPercents as { index, percentage, headingText }}
          <div>
            {#if index % 3 === 0 && index <= 6}
              <div class="px-2 py-4 pt-8" key={`padding-box-${index}`}>
                {#if headingText}
                  <p class="font-bold">{headingText}</p>
                {/if}
              </div>
            {/if}
            <tr key={`table-row-${index}`}>
              <td class={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                1x {reps(index) ?? weekToDefiningRep(week)}{index === 5 ? '+' : ''}
              </td>
              <td class={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                {percentageToText(percentage)}
              </td>
              <td class={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                {Math.max(
                  20,
                  roundToNearest(index) *
                    Math.ceil(
                      (baseWeights[dayToExercise(day)] * percentage) / roundToNearest(index)
                    )
                )} kg
              </td>
              <td class={index % 2 === 0 ? tableRowStyle : tableRowStyleAlt}>
                <!-- {repsField({ index, percentage })} -->
                -
              </td>
            </tr>
          </div>
        {/each}
      </tbody>
    </table>
  </div>
</div>
