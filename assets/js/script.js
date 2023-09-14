//Evento para que cargue el grafico apenas abra la pagina
document.addEventListener("DOMContentLoaded", async () => {
  var chartResult;
  //Traer DOM a JS
  const cantidad = document.getElementById("cantidad");
  const currency = document.getElementById("currency");
  const btn = document.getElementById("btn");
  const result = document.getElementById("result");
  //Traer la API
  const getApi = async () => {
    let data;
    try {
      const res = await fetch("https://mindicador.cl/api");
      data = await res.json();
    } catch (error) {
      alert(" No funciona la api https://mindicador.cl/api");
    }
    return data;
  };
  //Crear funcionalidad y evento
  const calcularCambio = async () => {
    const valores = await getApi();
    let conversion;
    if (currency.value === "dolar") {
      conversion = cantidad.value / valores.dolar.valor;
    } else if (currency.value === "euro") {
      conversion = cantidad.value / valores.euro.valor;
    } else if (currency.value === "utm") {
      conversion = cantidad.value / valores.utm.valor;
    } else {
      conversion = cantidad.value / valores.uf.valor;
    }
    result.innerHTML = `$${conversion.toFixed(4)}`;
  };
  btn.addEventListener("click", calcularCambio);

  //Grafico
  const getCurrencyChart = async (currencyType) => {
    let data;
    try {
      const res = await fetch(`https://mindicador.cl/api/${currencyType}`);
      data = await res.json();
    } catch (error) {
      alert(" No funciona la api https://mindicador.cl/api");
    }
    return data;
  };
  // Funcionalidad
  const drawChart = async (currencyType) => {
    chartResult = await getCurrencyChart(currencyType);

    const firstTen = chartResult.serie.slice(0, 10);
    const dates = firstTen.map((day) => {
      const dia = new Date(day.fecha);
      console.log(dia);
      return dia.toLocaleString("default", {
        month: "short",
        day: "2-digit",
      });
    });
    var options = {
      series: [
        {
          name: currencyType,
          data: firstTen.map((day) => day.valor),
        },
      ],
      chart: {
        height: 350,
        type: "area",
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Currency by day",
        align: "left",
      },
      grid: {
        row: {
          colors: ["#9dfcfb", "transparent"],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: dates,
      },
    };
    return options;
  };
  currency.addEventListener("change", async () => {
    chart.updateOptions(await drawChart(currency.value));
    calcularCambio();
  });
  var chart = new ApexCharts(document.querySelector("#chart"), await drawChart("dolar"));
  chart.render();
  console.log(chartResult);
});
