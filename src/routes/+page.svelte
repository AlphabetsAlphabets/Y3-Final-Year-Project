<script lang="ts">
  function handleClick(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const action = target.textContent;
    console.log(`Clicked on: ${action}`);
  }
</script>

<div class="container-md py-4">
  <button>
    <img src="/gear.svg" alt="gear" />
  </button>
  <form class="pt-4">
    <div class="mb-3">
      <select class="form-select" aria-label="Default select example">
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
      </select>
    </div>
    <div class="mb-3">
      <input
        type="checkbox"
        class="btn-check"
        id="btn-check-outlined"
        autocomplete="off"
      />
      <label class="btn btn-outline-success" for="btn-check-outlined"
        >Pomodoro</label
      ><br />
    </div>

    <button type="submit" class="btn btn-outline-success" on:click={handleClick}
      >Submit</button
    >
  </form>

  <div class="container text-center py-5 px-5">1 hour 50 minutes</div>
</div>
